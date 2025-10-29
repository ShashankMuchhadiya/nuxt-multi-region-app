import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getRateLimitConfig } from "@/server/utils/rate-limit";

// Create rate limiter instance
// For production, use Upstash Redis
// For development/local, use in-memory fallback
const redis =
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
		? new Redis({
				url: process.env.UPSTASH_REDIS_REST_URL,
				token: process.env.UPSTASH_REDIS_REST_TOKEN,
			})
		: null;

// In-memory rate limiter for development (fallback)
const memoryStore = new Map<string, { count: number; resetTime: number }>();

function getMemoryRateLimit(identifier: string, limit: number, window: number): boolean {
	const now = Date.now();
	const record = memoryStore.get(identifier);

	if (!record || now > record.resetTime) {
		memoryStore.set(identifier, { count: 1, resetTime: now + window * 1000 });
		return true;
	}

	if (record.count >= limit) {
		return false;
	}

	record.count++;
	return true;
}

export default defineEventHandler(async event => {
	// Skip rate limiting for static assets and internal routes
	if (
		event.node.req.url?.startsWith("/_nuxt/") ||
		event.node.req.url?.startsWith("/favicon.ico") ||
		event.node.req.url?.startsWith("/__nuxt")
	) {
		return;
	}

	// Get rate limit config based on path
	const config = getRateLimitConfig(event.node.req.url || "");

	// Get client identifier (IP address)
	const forwardedFor = event.node.req.headers["x-forwarded-for"];
	const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
	const realIp = event.node.req.headers["x-real-ip"];
	const identifier =
		forwardedIp?.split(",")[0]?.trim() ||
		(Array.isArray(realIp) ? realIp[0] : realIp) ||
		event.node.req.socket.remoteAddress ||
		"unknown";

	try {
		let allowed = true;
		let remaining = config.limit;

		if (redis) {
			// Use Upstash rate limiter (production)
			const ratelimit = new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(config.limit, `${config.window} s`),
				analytics: true,
				prefix: `@upstash/ratelimit:${config.limit}:${config.window}`,
			});

			const result = await ratelimit.limit(identifier);
			allowed = result.success;
			remaining = result.remaining;
		} else {
			// Use in-memory rate limiter (development)
			allowed = getMemoryRateLimit(identifier, config.limit, config.window);
			const record = memoryStore.get(identifier);
			remaining = record ? Math.max(0, config.limit - record.count) : config.limit - 1;
		}

		if (!allowed) {
			// Set rate limit headers
			setHeaders(event, {
				"X-RateLimit-Limit": String(config.limit),
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + config.window),
				"Retry-After": String(config.window),
			});

			// Return 429 Too Many Requests
			throw createError({
				statusCode: 429,
				statusMessage: "Too Many Requests",
				message: `Rate limit exceeded. Maximum ${config.limit} requests per ${config.window} seconds. Please try again later.`,
			});
		}

		// Set rate limit headers for successful requests
		setHeaders(event, {
			"X-RateLimit-Limit": String(config.limit),
			"X-RateLimit-Remaining": String(remaining),
			"X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + config.window),
		});
	} catch (error) {
		// Re-throw createError instances
		if (error && typeof error === "object" && "statusCode" in error) {
			throw error;
		}
		// Log other errors but don't block the request
		console.error("Rate limit error:", error);
	}
});
