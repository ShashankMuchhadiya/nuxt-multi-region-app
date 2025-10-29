import {
	isValidCountry,
	isValidLanguage,
	getCountry,
	getCountryFromIpapi,
	defaultCountry,
} from "@/app/config/locales";

// Define valid routes for the application
const validRoutes = [
	"", // home page
	"events",
	"events/tech-conference-2025",
	"events/web-development-workshop",
	"events/design-summit",
];

// Helper function to check if a route path is valid
function isValidRoute(pathSegments: string[], countryCode: string): boolean {
	// Remove country code from segments
	const segments = [...pathSegments];
	segments.shift(); // Remove country code

	// Check if there's a language code
	if (
		segments.length > 0 &&
		typeof countryCode === "string" &&
		segments[0] !== undefined &&
		isValidLanguage(countryCode, segments[0])
	) {
		segments.shift();
	}

	// Build the route path
	const routePath = segments.join("/");

	// Check if the route is valid
	return validRoutes.includes(routePath);
}

export default defineNuxtRouteMiddleware(async to => {
	// Skip middleware for root path - let client-side plugin handle geolocation
	if (to.path === "/") {
		// Don't redirect on server side, let client-side plugin handle it
		return;
	}

	const pathSegments = to.path.split("/").filter(Boolean);

	// No country in path (but not root), redirect to default country
	if (pathSegments.length === 0 && to.path !== "/") {
		return navigateTo(`/${defaultCountry.code}`, { redirectCode: 301 });
	}

	const countryCode = pathSegments[0];
	const langCode = pathSegments[1];

	// Invalid country, redirect to default country
	if (!countryCode || !isValidCountry(countryCode)) {
		return navigateTo(`/${defaultCountry.code}`, { redirectCode: 301 });
	}

	// Get country (either predefined or dynamic)
	const country = getCountry(countryCode) || getCountryFromIpapi(countryCode);
	if (!country) {
		return navigateTo(`/${defaultCountry.code}`, { redirectCode: 301 });
	}

	// If language is provided
	if (langCode && pathSegments.length > 1) {
		// Check if it's actually a language code or a page
		const isLang = isValidLanguage(countryCode, langCode);

		if (isLang) {
			// If it's the default language, remove it from URL
			if (langCode === country.defaultLang) {
				const restOfPath = pathSegments.slice(2).join("/");
				const newPath = `/${countryCode}${restOfPath ? `/${restOfPath}` : ""}`;
				return navigateTo(newPath, { redirectCode: 301 });
			}
			// Valid non-default language, allow it
		}
		// If second segment is not a valid language, it's a page path, continue
	}

	// Validate if the route exists
	if (!isValidRoute(pathSegments, countryCode)) {
		throw createError({
			statusCode: 404,
			statusMessage: "Page Not Found",
			fatal: false,
		});
	}

	// Valid country with default language (no lang in URL), allow it
	return;
});
