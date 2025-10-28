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

export const defaultCountry: Country = countries[0]; // India
export const defaultLanguage: Language = defaultCountry.languages[0]; // English

export function isValidCountry(code: string): boolean {
	return countries.some(c => c.code === code);
}

export function isValidLanguage(countryCode: string, langCode: string): boolean {
	const country = getCountry(countryCode);
	return country?.languages.some(l => l.code === langCode) ?? false;
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

	// Regional mappings for countries not in our list
	ca: "us", // Canada -> US (English)
	au: "gb", // Australia -> UK (English)
	nz: "gb", // New Zealand -> UK (English)
	it: "fr", // Italy -> France (closest European)
	nl: "de", // Netherlands -> Germany (closest European)
	be: "fr", // Belgium -> France (closest European)
	ch: "de", // Switzerland -> Germany (closest European)
	at: "de", // Austria -> Germany (closest European)
	pt: "es", // Portugal -> Spain (closest European)
	pl: "de", // Poland -> Germany (closest European)
	cz: "de", // Czech Republic -> Germany (closest European)
	hu: "de", // Hungary -> Germany (closest European)
	se: "de", // Sweden -> Germany (closest European)
	no: "de", // Norway -> Germany (closest European)
	dk: "de", // Denmark -> Germany (closest European)
	fi: "de", // Finland -> Germany (closest European)
	ie: "gb", // Ireland -> UK (closest English)
	za: "gb", // South Africa -> UK (closest English)
	eg: "ae", // Egypt -> UAE (closest Middle East)
	jo: "ae", // Jordan -> UAE (closest Middle East)
	lb: "ae", // Lebanon -> UAE (closest Middle East)
	kw: "ae", // Kuwait -> UAE (closest Middle East)
	qa: "ae", // Qatar -> UAE (closest Middle East)
	bh: "ae", // Bahrain -> UAE (closest Middle East)
	om: "ae", // Oman -> UAE (closest Middle East)
	pk: "in", // Pakistan -> India (closest South Asian)
	bd: "in", // Bangladesh -> India (closest South Asian)
	lk: "in", // Sri Lanka -> India (closest South Asian)
	np: "in", // Nepal -> India (closest South Asian)
	bt: "in", // Bhutan -> India (closest South Asian)
	mv: "in", // Maldives -> India (closest South Asian)
	my: "in", // Malaysia -> India (closest Asian)
	sg: "in", // Singapore -> India (closest Asian)
	th: "in", // Thailand -> India (closest Asian)
	ph: "in", // Philippines -> India (closest Asian)
	id: "in", // Indonesia -> India (closest Asian)
	vn: "in", // Vietnam -> India (closest Asian)
	kr: "in", // South Korea -> India (closest Asian)
	jp: "in", // Japan -> India (closest Asian)
	cn: "in", // China -> India (closest Asian)
	tw: "in", // Taiwan -> India (closest Asian)
	hk: "in", // Hong Kong -> India (closest Asian)
	mo: "in", // Macau -> India (closest Asian)
	br: "us", // Brazil -> US (closest Americas)
	mx: "us", // Mexico -> US (closest Americas)
	ar: "us", // Argentina -> US (closest Americas)
	cl: "us", // Chile -> US (closest Americas)
	co: "us", // Colombia -> US (closest Americas)
	pe: "us", // Peru -> US (closest Americas)
	ve: "us", // Venezuela -> US (closest Americas)
	ec: "us", // Ecuador -> US (closest Americas)
	uy: "us", // Uruguay -> US (closest Americas)
	py: "us", // Paraguay -> US (closest Americas)
	bo: "us", // Bolivia -> US (closest Americas)
	cr: "us", // Costa Rica -> US (closest Americas)
	pa: "us", // Panama -> US (closest Americas)
	gt: "us", // Guatemala -> US (closest Americas)
	hn: "us", // Honduras -> US (closest Americas)
	sv: "us", // El Salvador -> US (closest Americas)
	ni: "us", // Nicaragua -> US (closest Americas)
	cu: "us", // Cuba -> US (closest Americas)
	do: "us", // Dominican Republic -> US (closest Americas)
	ht: "us", // Haiti -> US (closest Americas)
	jm: "us", // Jamaica -> US (closest Americas)
	tt: "us", // Trinidad and Tobago -> US (closest Americas)
	bb: "us", // Barbados -> US (closest Americas)
	ru: "de", // Russia -> Germany (closest European)
	ua: "de", // Ukraine -> Germany (closest European)
	by: "de", // Belarus -> Germany (closest European)
	md: "de", // Moldova -> Germany (closest European)
	lt: "de", // Lithuania -> Germany (closest European)
	lv: "de", // Latvia -> Germany (closest European)
	ee: "de", // Estonia -> Germany (closest European)
	bg: "de", // Bulgaria -> Germany (closest European)
	ro: "de", // Romania -> Germany (closest European)
	hr: "de", // Croatia -> Germany (closest European)
	si: "de", // Slovenia -> Germany (closest European)
	sk: "de", // Slovakia -> Germany (closest European)
	rs: "de", // Serbia -> Germany (closest European)
	ba: "de", // Bosnia and Herzegovina -> Germany (closest European)
	me: "de", // Montenegro -> Germany (closest European)
	mk: "de", // North Macedonia -> Germany (closest European)
	al: "de", // Albania -> Germany (closest European)
	gr: "de", // Greece -> Germany (closest European)
	cy: "de", // Cyprus -> Germany (closest European)
	mt: "de", // Malta -> Germany (closest European)
	lu: "de", // Luxembourg -> Germany (closest European)
	is: "de", // Iceland -> Germany (closest European)
	li: "de", // Liechtenstein -> Germany (closest European)
	ad: "de", // Andorra -> Germany (closest European)
	mc: "de", // Monaco -> Germany (closest European)
	sm: "de", // San Marino -> Germany (closest European)
	va: "de", // Vatican City -> Germany (closest European)
};

/**
 * Get our app's country code from ipapi.co country code
 * @param ipapiCountryCode - Country code returned by ipapi.co
 * @returns Our app's country code or default country if not found
 */
export function mapIpapiCountryToAppCountry(ipapiCountryCode: string): string {
	const mappedCode = ipapiCountryMapping[ipapiCountryCode.toLowerCase()];
	return mappedCode || defaultCountry.code;
}

/**
 * Get country from ipapi.co country code
 * @param ipapiCountryCode - Country code returned by ipapi.co
 * @returns Country object or default country if not found
 */
export function getCountryFromIpapi(ipapiCountryCode: string): Country {
	const appCountryCode = mapIpapiCountryToAppCountry(ipapiCountryCode);
	return getCountry(appCountryCode) || defaultCountry;
}
