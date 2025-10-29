export interface GeolocationData {
	ip: string;
	city: string;
	region: string;
	region_code: string;
	country_code: string;
	country_code_iso3: string;
	country_name: string;
	country_capital: string;
	country_tld: string;
	continent_code: string;
	in_eu: boolean;
	postal: string;
	latitude: number;
	longitude: number;
	timezone: string;
	utc_offset: string;
	country_calling_code: string;
	currency: string;
	currency_name: string;
	languages: string;
	asn: string;
	org: string;
}

export interface GeolocationError {
	error: boolean;
	reason: string;
}

// Global state to prevent multiple API calls
const globalGeolocationData = ref<GeolocationData | null>(null);
const globalIsLoading = ref(false);
const globalError = ref<string | null>(null);
const globalLastFetch = ref<number>(0);

// Cache duration: 5 minutes (300000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

export const useGeolocation = () => {
	const geolocationData = globalGeolocationData;
	const isLoading = globalIsLoading;
	const error = globalError;

	/**
	 * Get geolocation data for a specific IP address
	 * @param ip - IP address to lookup (optional, defaults to user's IP)
	 */
	const getGeolocation = async (ip?: string): Promise<GeolocationData | null> => {
		// Check if we have cached data and it's still valid
		const now = Date.now();
		const isCacheValid = geolocationData.value && now - globalLastFetch.value < CACHE_DURATION && !ip; // Only use cache for current user's IP, not specific IPs

		if (isCacheValid) {
			return geolocationData.value;
		}

		// Check if already loading
		if (isLoading.value) {
			// Wait for current request to complete
			while (isLoading.value) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			return geolocationData.value;
		}

		isLoading.value = true;
		error.value = null;

		try {
			const apiKey = "UdZuFpBAhP05tXTvdVQJmKQwDlMGWj5ff0z3qfhf7F42WObLci";
			const url = ip
				? `https://ipapi.co/${ip}/json/?key=${apiKey}`
				: `https://ipapi.co/json/?key=${apiKey}`;

			// Use AbortController for timeout to prevent long blocking
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await $fetch<GeolocationData | GeolocationError>(url, {
				signal: controller.signal,
			});
			
			clearTimeout(timeoutId);

			// Check if the response contains an error
			if ("error" in response && response.error) {
				console.error("API returned error:", response.reason);
				throw new Error(response.reason || "Geolocation lookup failed");
			}

			geolocationData.value = response as GeolocationData;
			globalLastFetch.value = now;
			return geolocationData.value;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to get geolocation data";
			error.value = errorMessage;
			console.error("Geolocation error:", errorMessage);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	/**
	 * Get user's current geolocation (their own IP)
	 */
	const getCurrentLocation = async (): Promise<GeolocationData | null> => {
		return await getGeolocation();
	};

	/**
	 * Get geolocation for a specific IP address
	 */
	const getLocationByIP = async (ip: string): Promise<GeolocationData | null> => {
		return await getGeolocation(ip);
	};

	/**
	 * Get specific field from geolocation data
	 * @param field - Field name to retrieve
	 * @param ip - IP address (optional)
	 */
	const getField = async (
		field: keyof GeolocationData,
		ip?: string
	): Promise<string | number | boolean | null> => {
		try {
			const apiKey = "UdZuFpBAhP05tXTvdVQJmKQwDlMGWj5ff0z3qfhf7F42WObLci";
			const url = ip
				? `https://ipapi.co/${ip}/${field}/?key=${apiKey}`
				: `https://ipapi.co/${field}/?key=${apiKey}`;

			const response = await $fetch<string | number | boolean>(url);
			return response;
		} catch (err) {
			console.error(`Failed to get ${field}:`, err);
			return null;
		}
	};

	/**
	 * Get country code for current user or specific IP
	 */
	const getCountryCode = async (ip?: string): Promise<string | null> => {
		const result = await getField("country_code", ip);
		return typeof result === "string" ? result.toLowerCase() : null;
	};

	/**
	 * Get country name for current user or specific IP
	 */
	const getCountryName = async (ip?: string): Promise<string | null> => {
		const result = await getField("country_name", ip);
		return typeof result === "string" ? result : null;
	};

	/**
	 * Get city for current user or specific IP
	 */
	const getCity = async (ip?: string): Promise<string | null> => {
		const result = await getField("city", ip);
		return typeof result === "string" ? result : null;
	};

	/**
	 * Get timezone for current user or specific IP
	 */
	const getTimezone = async (ip?: string): Promise<string | null> => {
		const result = await getField("timezone", ip);
		return typeof result === "string" ? result : null;
	};

	/**
	 * Clear cached geolocation data
	 */
	const clearCache = () => {
		geolocationData.value = null;
		globalLastFetch.value = 0;
		error.value = null;
	};

	/**
	 * Force refresh geolocation data (ignores cache)
	 */
	const forceRefresh = async (ip?: string): Promise<GeolocationData | null> => {
		clearCache();
		return await getGeolocation(ip);
	};

	return {
		geolocationData: readonly(geolocationData),
		isLoading: readonly(isLoading),
		error: readonly(error),
		getGeolocation,
		getCurrentLocation,
		getLocationByIP,
		getField,
		getCountryCode,
		getCountryName,
		getCity,
		getTimezone,
		clearCache,
		forceRefresh,
	};
};
