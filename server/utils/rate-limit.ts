// Rate limiting configuration
// This file provides helper functions for rate limiting

export interface RateLimitConfig {
	limit: number; // Number of requests
	window: number; // Time window in seconds
}

export const rateLimitConfigs = {
	// General API routes
	api: {
		limit: 10,
		window: 10, // 10 requests per 10 seconds
	},
	// Geolocation API
	geolocation: {
		limit: 20,
		window: 60, // 20 requests per minute
	},
	// Public pages
	public: {
		limit: 100,
		window: 60, // 100 requests per minute
	},
} as const;

export function getRateLimitConfig(path: string): RateLimitConfig {
	if (path.startsWith("/api/geolocation") || path.includes("ipapi.co")) {
		return rateLimitConfigs.geolocation;
	}

	if (path.startsWith("/api/")) {
		return rateLimitConfigs.api;
	}

	return rateLimitConfigs.public;
}
