export default defineNuxtPlugin(nuxtApp => {
	const route = useRoute();

	// Mapping of locale codes to full language tags
	const languageMap: Record<string, string> = {
		en: "en-US",
		ar: "ar-SA",
		fr: "fr-FR",
		de: "de-DE",
		es: "es-ES",
	};

	// Extract language from route path
	const pathSegments = route.path.split("/").filter(Boolean);
	let langCode = "en"; // default

	if (pathSegments.length >= 2) {
		// Check if second segment is a language code
		const possibleLang = pathSegments[1];
		if (languageMap[possibleLang]) {
			langCode = possibleLang;
		}
	} else if (pathSegments.length === 1) {
		// Default language based on country
		const countryCode = pathSegments[0];
		const defaultLangs: Record<string, string> = {
			ae: "ar",
			sa: "ar",
			fr: "fr",
			de: "de",
			es: "es",
		};
		langCode = defaultLangs[countryCode] || "en";
	}

	const langAttr = languageMap[langCode] || "en-US";

	// Set the HTML lang attribute for SSR
	nuxtApp.hook("app:rendered", () => {
		if (process.server) {
			useHead({
				htmlAttrs: {
					lang: langAttr,
					dir: langCode === "ar" ? "rtl" : "ltr",
				},
			});
		}
	});

	// Also set it immediately via useHead
	useHead({
		htmlAttrs: {
			lang: langAttr,
			dir: langCode === "ar" ? "rtl" : "ltr",
		},
	});
});
