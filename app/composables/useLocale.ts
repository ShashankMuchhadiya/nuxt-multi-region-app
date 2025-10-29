import {
	countries,
	getCountry,
	getCountryFromIpapi,
	defaultCountry,
	defaultLanguage,
	isValidLanguage,
} from "@/app/config/locales";
import type { Country, Language } from "@/app/config/locales";

export const useMultiLocale = () => {
	const route = useRoute();
	const router = useRouter();
	const { locale, setLocale } = useI18n(); // Use i18n composable

	// Get current country and language from route
	const currentCountry = computed((): Country => {
		// Extract country from URL path directly to handle invalid routes
		const pathSegments = route.path.split("/").filter(Boolean);
		const countryCode = pathSegments[0];

		if (!countryCode) return defaultCountry;

		// Try to get predefined country first, then create dynamic country
		const country = getCountry(countryCode) || getCountryFromIpapi(countryCode);
		return country ?? defaultCountry;
	});

	const currentLanguage = computed((): Language => {
		// Extract language from URL path directly to handle invalid routes
		const pathSegments = route.path.split("/").filter(Boolean);
		const langCode = pathSegments[1] || currentCountry.value.defaultLang;

		const language = currentCountry.value.languages.find((l: Language) => l.code === langCode);
		if (language) return language;
		return currentCountry.value.languages[0] ?? defaultLanguage;
	});

	// Check if current language is default for the country
	const isDefaultLanguage = computed(() => {
		return currentLanguage.value?.code === currentCountry.value.defaultLang;
	});

	// Sync i18n locale with current language
	watch(
		currentLanguage,
		newLang => {
			if (newLang && locale.value !== newLang.code) {
				setLocale(newLang.code as typeof locale.value);
			}
		},
		{ immediate: true }
	);

	// Ensure locale is set correctly on both server and client
	onMounted(() => {
		const lang = currentLanguage.value;
		if (lang && locale.value !== lang.code) {
			setLocale(lang.code as typeof locale.value);
		}
	});

	// Switch language
	const switchLanguage = async (country: Country, language: Language) => {
		const isDefault = language.code === country.defaultLang;

		// Extract the path segments after country and language
		const pathSegments = route.path.split("/").filter(Boolean);
		let restOfPath = "";

		// If we have a language in the URL, skip it when building the rest of the path
		if (
			pathSegments.length > 1 &&
			pathSegments[0] &&
			pathSegments[1] &&
			isValidLanguage(pathSegments[0], pathSegments[1])
		) {
			// Current URL has language, so rest of path starts from index 2
			restOfPath = pathSegments.slice(2).join("/");
		} else {
			// Current URL doesn't have language, so rest of path starts from index 1
			restOfPath = pathSegments.slice(1).join("/");
		}

		const basePath = restOfPath ? `/${restOfPath}` : "";

		let newPath: string;
		if (isDefault) {
			// Default language: /country
			newPath = `/${country.code}${basePath}`;
		} else {
			// Non-default language: /country/lang
			newPath = `/${country.code}/${language.code}${basePath}`;
		}

		// Set i18n locale before navigation
		await setLocale(language.code as typeof locale.value);
		await router.push(newPath);
	};

	// Get localized path
	const localePath = (path: string = ""): string => {
		const cleanPath = path.startsWith("/") ? path.slice(1) : path;
		const country = currentCountry.value.code;
		const lang = currentLanguage.value.code;
		const isDefault = lang === currentCountry.value.defaultLang;

		if (isDefault) {
			return `/${country}${cleanPath ? `/${cleanPath}` : ""}`;
		} else {
			return `/${country}/${lang}${cleanPath ? `/${cleanPath}` : ""}`;
		}
	};

	return {
		currentCountry,
		currentLanguage,
		isDefaultLanguage,
		countries,
		switchLanguage,
		localePath,
	};
};
