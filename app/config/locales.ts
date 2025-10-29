export interface Language {
	code: string;
	name: string;
}

export interface Country {
	code: string;
	name: string;
	flag: string;
	defaultLang: string;
	languages: Language[];
}

export const countries: Country[] = [
	{
		code: "in",
		name: "India",
		flag: "🇮🇳",
		defaultLang: "en",
		languages: [{ code: "en", name: "English" }],
	},
	{
		code: "ae",
		name: "UAE",
		flag: "🇦🇪",
		defaultLang: "ar",
		languages: [
			{ code: "ar", name: "Arabic" },
			{ code: "en", name: "English" },
		],
	},
	{
		code: "sa",
		name: "Saudi Arabia",
		flag: "🇸🇦",
		defaultLang: "ar",
		languages: [
			{ code: "ar", name: "Arabic" },
			{ code: "en", name: "English" },
		],
	},
	{
		code: "us",
		name: "United States",
		flag: "🇺🇸",
		defaultLang: "en",
		languages: [{ code: "en", name: "English" }],
	},
	{
		code: "gb",
		name: "United Kingdom",
		flag: "🇬🇧",
		defaultLang: "en",
		languages: [{ code: "en", name: "English" }],
	},
	{
		code: "fr",
		name: "France",
		flag: "🇫🇷",
		defaultLang: "fr",
		languages: [
			{ code: "fr", name: "French" },
			{ code: "en", name: "English" },
		],
	},
	{
		code: "de",
		name: "Germany",
		flag: "🇩🇪",
		defaultLang: "de",
		languages: [
			{ code: "de", name: "German" },
			{ code: "en", name: "English" },
		],
	},
	{
		code: "es",
		name: "Spain",
		flag: "🇪🇸",
		defaultLang: "es",
		languages: [
			{ code: "es", name: "Spanish" },
			{ code: "en", name: "English" },
		],
	},
];

export function getCountry(code: string): Country | undefined {
	return countries.find(c => c.code === code);
}

export const defaultCountry: Country = countries[0]!;
export const defaultLanguage: Language = defaultCountry.languages[0]!;

export function isValidCountry(code: string): boolean {
	// Accept any 2-letter country code (ISO 3166-1 alpha-2)
	return /^[a-z]{2}$/i.test(code);
}

export function isValidLanguage(countryCode: string, langCode: string): boolean {
	const country = getCountry(countryCode);
	if (country) {
		return country.languages.some(l => l.code === langCode);
	}

	// For dynamic countries (not in our predefined list), only English is valid
	return langCode === "en";
}

/**
 * Maps IP geolocation country codes to our app's country codes
 * This mapping handles cases where ipapi.co returns different country codes
 * than what we use in our application
 */
export const ipapiCountryMapping: Record<string, string> = {
	// Direct mappings (same codes)
	us: "us",
	gb: "gb",
	fr: "fr",
	de: "de",
	es: "es",
	in: "in",
	ae: "ae",
	sa: "sa",

	// Alternative mappings
	uk: "gb", // United Kingdom alternative code
	usa: "us", // United States alternative
	ind: "in", // India alternative
	uae: "ae", // UAE alternative
	ksa: "sa", // Saudi Arabia alternative

	// Note: All country mappings have been removed
	// Unmapped countries will now use their actual country code with English content
	// Example: AU -> /au, CA -> /ca, etc.
};

/**
 * Get our app's country code from ipapi.co country code
 * @param ipapiCountryCode - Country code returned by ipapi.co
 * @returns Our app's country code or the original country code if not found
 */
export function mapIpapiCountryToAppCountry(ipapiCountryCode: string): string {
	const mappedCode = ipapiCountryMapping[ipapiCountryCode.toLowerCase()];
	return mappedCode || ipapiCountryCode.toLowerCase();
}

/**
 * Get country from ipapi.co country code
 * @param ipapiCountryCode - Country code returned by ipapi.co
 * @returns Country object or a dynamic country with English language if not found
 */
export function getCountryFromIpapi(ipapiCountryCode: string): Country {
	const appCountryCode = mapIpapiCountryToAppCountry(ipapiCountryCode);
	const existingCountry = getCountry(appCountryCode);

	if (existingCountry) {
		return existingCountry;
	}

	// Create a dynamic country for unmapped country codes
	return {
		code: appCountryCode,
		name: ipapiCountryCode.toUpperCase(), // Use uppercase for display
		flag: "🌍", // Default globe flag for unmapped countries
		defaultLang: "en",
		languages: [{ code: "en", name: "English" }],
	};
}

/**
 * Maps language codes from ipapi.co to our supported language codes
 * This handles cases where the API returns different language codes than what we use
 */
export const languageMapping: Record<string, string> = {
	// Direct mappings
	en: "en",
	ar: "ar",
	fr: "fr",
	de: "de",
	es: "es",

	// Alternative mappings
	"en-US": "en",
	"en-GB": "en",
	"en-CA": "en",
	"en-AU": "en",
	"en-NZ": "en",
	"en-ZA": "en",
	"en-IE": "en",
	"en-IN": "en",
	"ar-AE": "ar",
	"ar-SA": "ar",
	"ar-EG": "ar",
	"ar-JO": "ar",
	"ar-LB": "ar",
	"ar-KW": "ar",
	"ar-QA": "ar",
	"ar-BH": "ar",
	"ar-OM": "ar",
	"fr-FR": "fr",
	"fr-CA": "fr",
	"fr-BE": "fr",
	"fr-CH": "fr",
	"fr-LU": "fr",
	"fr-MC": "fr",
	"de-DE": "de",
	"de-AT": "de",
	"de-CH": "de",
	"de-LI": "de",
	"de-LU": "de",
	"es-ES": "es",
	"es-MX": "es",
	"es-AR": "es",
	"es-CL": "es",
	"es-CO": "es",
	"es-PE": "es",
	"es-VE": "es",
	"es-EC": "es",
	"es-UY": "es",
	"es-PY": "es",
	"es-BO": "es",
	"es-CR": "es",
	"es-PA": "es",
	"es-GT": "es",
	"es-HN": "es",
	"es-SV": "es",
	"es-NI": "es",
	"es-CU": "es",
	"es-DO": "es",
	"es-HT": "es",
	"es-JM": "es",
	"es-TT": "es",
	"es-BB": "es",
};

/**
 * Detect the best language for a country based on ipapi.co language data
 * @param country - The country object
 * @param apiLanguages - Languages string from ipapi.co (e.g., "en-US,es-US,haw,fr")
 * @returns The best matching language code for the country
 */
export function detectLanguageForCountry(country: Country, apiLanguages: string): string {
	// Split the languages string and clean up
	const languages = apiLanguages
		.split(",")
		.map(lang => lang.trim())
		.filter(lang => lang.length > 0);

	// First, try to find an exact match for the country's supported languages
	for (const supportedLang of country.languages) {
		for (const apiLang of languages) {
			// Direct match
			if (apiLang === supportedLang.code) {
				return supportedLang.code;
			}
			// Mapped match
			const mappedLang = languageMapping[apiLang];
			if (mappedLang === supportedLang.code) {
				return supportedLang.code;
			}
		}
	}

	// If no exact match, try to find a partial match (e.g., "en" in "en-US")
	for (const supportedLang of country.languages) {
		for (const apiLang of languages) {
			if (
				apiLang.startsWith(supportedLang.code + "-") ||
				apiLang.startsWith(supportedLang.code + "_")
			) {
				return supportedLang.code;
			}
		}
	}

	// Fallback to the country's default language
	return country.defaultLang;
}
