/**
 * SEO Helper utilities for generating meta tags and structured data
 */

/**
 * Language code to full language tag mapping
 */
export const languageMap: Record<string, string> = {
	en: "en-US",
	ar: "ar-SA",
	fr: "fr-FR",
	de: "de-DE",
	es: "es-ES",
};

/**
 * Get language tag from language code
 */
export const getLanguageTag = (langCode: string): string => {
	return languageMap[langCode] || "en-US";
};

/**
 * Check if language is RTL
 */
export const isRTLLanguage = (langCode: string): boolean => {
	return langCode === "ar";
};

/**
 * Generate page title with site name
 */
export const generatePageTitle = (
	title: string,
	siteName: string = "Multi-Region Multi-Language App"
): string => {
	return `${title} | ${siteName}`;
};

/**
 * Truncate description to optimal length for SEO
 */
export const truncateDescription = (description: string, maxLength: number = 160): string => {
	if (description.length <= maxLength) return description;
	return description.substring(0, maxLength - 3) + "...";
};

/**
 * Generate keywords from array
 */
export const generateKeywords = (keywords: string[]): string => {
	return keywords.join(", ");
};

/**
 * Default country-language mappings
 */
export const countryDefaultLanguages: Record<string, string> = {
	in: "en",
	ae: "ar",
	sa: "ar",
	us: "en",
	gb: "en",
	fr: "fr",
	de: "de",
	es: "es",
};

/**
 * Get default language for a country
 */
export const getDefaultLanguageForCountry = (countryCode: string): string => {
	return countryDefaultLanguages[countryCode] || "en";
};

/**
 * Build full URL
 */
export const buildFullUrl = (path: string, siteUrl: string): string => {
	// Remove trailing slash from siteUrl
	const cleanSiteUrl = siteUrl.replace(/\/$/, "");
	// Ensure path starts with /
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${cleanSiteUrl}${cleanPath}`;
};

/**
 * Generate image URL
 */
export const buildImageUrl = (imagePath: string, siteUrl: string): string => {
	if (imagePath.startsWith("http")) return imagePath;
	return buildFullUrl(imagePath, siteUrl);
};

/**
 * Common meta tag templates
 */
export const metaTemplates = {
	home: {
		title: "Home",
		description: "Welcome to our multi-region, multi-language platform",
		keywords: ["home", "multi-language", "international", "multi-region"],
	},
	events: {
		title: "Events",
		description: "Browse upcoming events and conferences in your region",
		keywords: ["events", "conferences", "workshops", "meetups"],
	},
	about: {
		title: "About Us",
		description: "Learn more about our company and mission",
		keywords: ["about", "company", "mission", "team"],
	},
};

/**
 * Get optimal image dimensions for social sharing
 */
export const socialImageDimensions = {
	openGraph: {
		width: 1200,
		height: 630,
	},
	twitter: {
		width: 1200,
		height: 600,
	},
};

/**
 * Generate alternate links for multi-language pages
 */
export const generateAlternateLinks = (
	path: string,
	languages: string[],
	siteUrl: string
): Array<{ hreflang: string; href: string }> => {
	const alternates = languages.map(lang => ({
		hreflang: getLanguageTag(lang),
		href: buildFullUrl(path, siteUrl),
	}));

	// Add x-default
	alternates.push({
		hreflang: "x-default",
		href: buildFullUrl("/us", siteUrl),
	});

	return alternates;
};

/**
 * Validate and sanitize meta description
 */
export const sanitizeMetaDescription = (description: string): string => {
	// Remove HTML tags
	const withoutHtml = description.replace(/<[^>]*>/g, "");
	// Remove extra whitespace
	const cleaned = withoutHtml.replace(/\s+/g, " ").trim();
	// Truncate to optimal length
	return truncateDescription(cleaned);
};

/**
 * Generate SEO-friendly slug
 */
export const generateSlug = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

/**
 * Common robots meta values
 */
export const robotsDirectives = {
	indexFollow: "index, follow",
	noIndexNoFollow: "noindex, nofollow",
	indexNoFollow: "index, nofollow",
	noIndexFollow: "noindex, follow",
};

/**
 * Get country name from country code
 */
export const countryNames: Record<string, string> = {
	in: "India",
	ae: "UAE",
	sa: "Saudi Arabia",
	us: "United States",
	gb: "United Kingdom",
	fr: "France",
	de: "Germany",
	es: "Spain",
};

export const getCountryName = (countryCode: string): string => {
	return countryNames[countryCode] || countryCode.toUpperCase();
};

/**
 * Generate breadcrumb schema for common patterns
 */
export const generateBreadcrumbs = (
	pathSegments: Array<{ name: string; path: string }>
): Array<{ name: string; path: string; position: number }> => {
	return pathSegments.map((segment, index) => ({
		...segment,
		position: index + 1,
	}));
};
