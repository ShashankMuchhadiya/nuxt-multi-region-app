export default defineNuxtPlugin(() => {
	const route = useRoute();
	const { setLocale } = useI18n();

	// Extract language from route during SSR
	const pathSegments = route.path.split("/").filter(Boolean);
	const countryCode = pathSegments[0];
	const langCode = pathSegments[1];

	// Set locale based on route during SSR
	if (countryCode && langCode) {
		// Check if it's a valid language code
		const validLanguages = ["en", "ar", "fr", "de", "es"];
		if (validLanguages.includes(langCode)) {
			setLocale(langCode as any);
		}
	}
});
