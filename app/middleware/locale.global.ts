import {
	isValidCountry,
	isValidLanguage,
	getCountry,
	defaultCountry,
	getCountryFromIpapi,
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
	// Skip middleware for root path
	if (to.path === "/") {
		// Try to detect user's location and redirect accordingly
		try {
			const { getCountryCode } = useGeolocation();
			const userCountryCode = await getCountryCode();

			if (userCountryCode) {
				const detectedCountry = getCountryFromIpapi(userCountryCode);

				// Get the default language for the detected country
				const defaultLanguage = detectedCountry.languages.find(
					lang => lang.code === detectedCountry.defaultLang
				);

				// Redirect to country with default language
				// If it's the default language, don't include it in URL
				if (defaultLanguage && defaultLanguage.code === detectedCountry.defaultLang) {
					return navigateTo(`/${detectedCountry.code}`, { redirectCode: 301 });
				} else {
					// Fallback: redirect to country without language (will use default)
					return navigateTo(`/${detectedCountry.code}`, { redirectCode: 301 });
				}
			}
		} catch (error) {
			console.warn("Failed to detect user location, using default country:", error);
		}

		// Fallback to default country if geolocation fails
		return navigateTo(`/${defaultCountry.code}`, { redirectCode: 301 });
	}

	const pathSegments = to.path.split("/").filter(Boolean);

	// No country in path, redirect to default
	if (pathSegments.length === 0) {
		return navigateTo(`/${defaultCountry.code}`, { redirectCode: 301 });
	}

	const countryCode = pathSegments[0];
	const langCode = pathSegments[1];

	// Invalid country, redirect to default
	if (!countryCode || !isValidCountry(countryCode)) {
		return navigateTo(`/${defaultCountry.code}`, { redirectCode: 301 });
	}

	const country = getCountry(countryCode);
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
