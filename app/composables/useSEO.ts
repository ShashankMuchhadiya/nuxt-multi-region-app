interface SEOOptions {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: string;
	keywords?: string;
	author?: string;
	twitterCard?: string;
}

export const useSEO = (options: SEOOptions = {}) => {
	const route = useRoute();
	const { currentLanguage, currentCountry } = useMultiLocale();
	const config = useRuntimeConfig();

	// Mapping of locale codes to full language tags
	const languageMap: Record<string, string> = {
		en: "en-US",
		ar: "ar-SA",
		fr: "fr-FR",
		de: "de-DE",
		es: "es-ES",
	};

	const siteUrl = config.public.siteUrl || "https://yourwebsite.com";
	const currentLocale = currentLanguage.value?.code || "en";
	const currentLangTag = languageMap[currentLocale] || "en-US";
	const isRTL = currentLocale === "ar";

	// Build canonical URL
	const canonicalUrl = options.url || `${siteUrl}${route.path}`;

	// Build hreflang alternates
	const alternateLinks: Array<{ rel: string; hreflang: string; href: string }> = [];

	// Add alternate links for available languages in this country
	currentCountry.value?.languages?.forEach(lang => {
		const langTag = languageMap[lang.code] || "en-US";
		const isDefault = lang.code === currentCountry.value.defaultLang;

		// Extract the path after country and language
		const pathSegments = route.path.split("/").filter(Boolean);
		let restOfPath = "";

		if (pathSegments.length > 1 && languageMap[pathSegments[1]]) {
			restOfPath = pathSegments.slice(2).join("/");
		} else {
			restOfPath = pathSegments.slice(1).join("/");
		}

		const basePath = restOfPath ? `/${restOfPath}` : "";
		const alternatePath = isDefault
			? `/${currentCountry.value.code}${basePath}`
			: `/${currentCountry.value.code}/${lang.code}${basePath}`;

		alternateLinks.push({
			rel: "alternate",
			hreflang: langTag,
			href: `${siteUrl}${alternatePath}`,
		});
	});

	// Add x-default for English
	alternateLinks.push({
		rel: "alternate",
		hreflang: "x-default",
		href: `${siteUrl}/us`, // Default to US English
	});

	// Default SEO values
	const defaultTitle = "Multi-Region Multi-Language App";
	const defaultDescription =
		"A multi-region and multi-language website supporting various countries and languages";
	const defaultImage = `${siteUrl}/og-image.jpg`;

	const title = options.title || defaultTitle;
	const description = options.description || defaultDescription;
	const image = options.image || defaultImage;
	const type = options.type || "website";
	const keywords = options.keywords || "multi-language, multi-region, international";
	const author = options.author || "Your Company Name";
	const twitterCard = options.twitterCard || "summary_large_image";

	// Set head metadata
	useHead({
		htmlAttrs: {
			lang: currentLangTag,
			dir: isRTL ? "rtl" : "ltr",
		},
		title,
		meta: [
			// Basic meta tags
			{ name: "description", content: description },
			{ name: "keywords", content: keywords },
			{ name: "author", content: author },

			// Open Graph meta tags
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:type", content: type },
			{ property: "og:url", content: canonicalUrl },
			{ property: "og:image", content: image },
			{ property: "og:site_name", content: defaultTitle },
			{ property: "og:locale", content: currentLangTag },

			// Twitter Card meta tags
			{ name: "twitter:card", content: twitterCard },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },

			// Additional SEO meta tags
			{ name: "robots", content: "index, follow" },
			{ name: "googlebot", content: "index, follow" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
		],
		link: [
			// Canonical URL
			{ rel: "canonical", href: canonicalUrl },

			// Alternate language links
			...alternateLinks,
		],
	});

	return {
		currentLanguage,
		currentCountry,
		currentLocale,
		currentLangTag,
		isRTL,
		canonicalUrl,
		alternateLinks,
	};
};
