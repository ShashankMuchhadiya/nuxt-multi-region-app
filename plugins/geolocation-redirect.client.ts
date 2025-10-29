export default defineNuxtPlugin(async () => {
	// Wait for the app to be fully hydrated
	await nextTick();

	const route = useRoute();
	const router = useRouter();

	// Only handle root path redirects
	if (route.path !== "/") {
		return;
	}

	// Defer geolocation to reduce TBT using requestIdleCallback
	requestIdleCallback(async () => {
		try {
			const { getCurrentLocation } = useGeolocation();
			const { getCountryFromIpapi, detectLanguageForCountry } = await import("@/app/config/locales");

			// Add timeout to prevent long blocking
			const geolocationData = await Promise.race([
				getCurrentLocation(),
				new Promise<null>((_, reject) => 
					setTimeout(() => reject(new Error('Geolocation timeout')), 3000)
				)
			]);

			if (geolocationData && geolocationData.country_code) {
				try {
					const detectedCountry = getCountryFromIpapi(geolocationData.country_code);

					// Detect the best language for this country based on the API's language data
					const detectedLanguageCode = detectLanguageForCountry(
						detectedCountry,
						geolocationData.languages || ""
					);

					// Find the language object
					const detectedLanguage = detectedCountry.languages.find(
						lang => lang.code === detectedLanguageCode
					);

					// Redirect to country with detected language
					// If it's the default language, don't include it in URL
					let redirectPath: string;
					if (detectedLanguage && detectedLanguage.code === detectedCountry.defaultLang) {
						redirectPath = `/${detectedCountry.code}`;
					} else if (detectedLanguage) {
						// Non-default language, include it in URL
						redirectPath = `/${detectedCountry.code}/${detectedLanguage.code}`;
					} else {
						// Fallback: redirect to country without language (will use default)
						redirectPath = `/${detectedCountry.code}`;
					}

					// Only redirect if we're not already on the target path
					if (route.path !== redirectPath) {
						await router.push(redirectPath);
					}
					return; // Successfully redirected, exit early
				} catch (countryError) {
					console.error("Error processing country:", countryError);
					// If we have a country code but processing failed, still try to redirect to it
					if (geolocationData.country_code) {
						const fallbackPath = `/${geolocationData.country_code.toLowerCase()}`;
						await router.push(fallbackPath);
						return;
					}
				}
			}
		} catch (error) {
			console.error("Failed to detect user location:", error);
		}

		// Fallback to default country if geolocation fails
		const { defaultCountry } = await import("@/app/config/locales");

		// Only redirect if we're not already on the target path
		if (route.path !== `/${defaultCountry.code}`) {
			await router.push(`/${defaultCountry.code}`);
		}
	});
});
