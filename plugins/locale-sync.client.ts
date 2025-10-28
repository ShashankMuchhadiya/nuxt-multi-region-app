export default defineNuxtPlugin(() => {
	const { currentLanguage } = useMultiLocale();
	const { locale, setLocale } = useI18n();

	// Ensure locale is synchronized on client-side hydration
	watch(
		currentLanguage,
		newLang => {
			if (newLang && locale.value !== newLang.code) {
				setLocale(newLang.code as typeof locale.value);
			}
		},
		{ immediate: true }
	);
});
