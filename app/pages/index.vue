<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p class="text-gray-600">Detecting your location...</p>
			<p class="text-sm text-gray-500 mt-2">
				Please wait while we redirect you to the appropriate region.
			</p>

			<!-- Debug info -->
			<div class="mt-8 p-4 bg-white rounded-lg shadow">
				<h3 class="font-semibold mb-2">Debug Information:</h3>
				<p class="text-sm">Current URL: {{ currentUrl }}</p>
				<p class="text-sm">Plugin loaded: {{ pluginLoaded }}</p>
				<p class="text-sm">Geolocation status: {{ geolocationStatus }}</p>
				<p class="text-sm">API response: {{ apiResponse }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// This page will be shown briefly while the client-side geolocation plugin
// detects the user's location and redirects them to the appropriate country/language

const currentUrl = ref("");
const pluginLoaded = ref(false);
const geolocationStatus = ref("Not started");
const apiResponse = ref("");

// Check if plugin is loaded
onMounted(() => {
	currentUrl.value = window.location.href;
	pluginLoaded.value = true;

	// Test geolocation API directly
	setTimeout(async () => {
		try {
			geolocationStatus.value = "Testing API...";

			const response = await fetch(
				"https://ipapi.co/json/?key=UdZuFpBAhP05tXTvdVQJmKQwDlMGWj5ff0z3qfhf7F42WObLci"
			);
			const data = await response.json();

			apiResponse.value = JSON.stringify(data, null, 2);
			geolocationStatus.value = "API working";

			// If we get here, the API is working, so redirect manually
			if (data.country_code) {
				window.location.href = `/${data.country_code.toLowerCase()}`;
			}
		} catch (error) {
			geolocationStatus.value = "API failed";
			console.error("Geolocation API test failed:", error);
		}
	}, 2000);
});

// Set a timeout as a fallback in case the plugin doesn't work
const router = useRouter();
setTimeout(() => {
	router.push("/in");
}, 10000);
</script>
