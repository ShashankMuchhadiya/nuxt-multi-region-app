export default defineNuxtPlugin(() => {
	const route = useRoute();
	const { locale } = useI18n();

	// Mapping of locale codes to full language tags
	const languageMap: Record<string, string> = {
		en: "en-US",
		ar: "ar-SA",
		fr: "fr-FR",
		de: "de-DE",
		es: "es-ES",
	};

	// Function to update the lang attribute
	const updateHtmlLang = (localeCode: string) => {
		const langAttr = languageMap[localeCode] || "en-US";
		document.documentElement.setAttribute("lang", langAttr);
	};

	// Set initial lang attribute
	updateHtmlLang(locale.value);

	// Watch for locale changes
	watch(locale, newLocale => {
		updateHtmlLang(newLocale);
	});

	// Watch for route changes (in case locale changes via routing)
	watch(
		() => route.path,
		() => {
			// Extract language from route path
			const pathSegments = route.path.split("/").filter(Boolean);
			if (pathSegments.length >= 2) {
				const langCode = pathSegments[1];
				if (languageMap[langCode]) {
					updateHtmlLang(langCode);
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
				updateHtmlLang(defaultLangs[countryCode] || "en");
			}
		}
	);
});
