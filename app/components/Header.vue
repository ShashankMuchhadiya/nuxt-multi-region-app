<template>
	<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
		<div class="container mx-auto px-4">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<LocalizedLink to="/" class="flex items-center gap-2 font-semibold text-gray-900">
					<span class="text-lg">Multi Region Demo App</span>
				</LocalizedLink>

				<!-- Desktop Navigation -->
				<div class="flex items-center gap-6">
					<nav class="hidden items-center gap-6 md:flex" aria-label="Desktop navigation">
						<LocalizedLink
							to="/"
							class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
						>
							{{ t("nav.home") }}
						</LocalizedLink>
						<LocalizedLink
							to="/events"
							class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
						>
							{{ t("nav.events") }}
						</LocalizedLink>
					</nav>

					<!-- Language/Country Dropdown -->
					<div class="relative hidden md:block">
						<button
							class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 cursor-pointer"
							aria-label="Select language and country"
							@click="dropdownOpen = !dropdownOpen"
						>
							<span>{{ currentCountry?.flag }} {{ currentLanguage?.code.toUpperCase() }}</span>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						<!-- Dropdown Menu -->
						<div
							v-if="dropdownOpen"
							:class="[
								'absolute mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg',
								isRTL ? 'left-0' : 'right-0',
							]"
						>
							<div class="max-h-96 overflow-y-auto p-2">
								<div v-for="country in countries" :key="country.code" class="mb-2">
									<div class="px-3 py-2 text-xs font-semibold text-gray-500">
										{{ country.flag }} {{ country.name }}
									</div>
									<button
										v-for="lang in country.languages"
										:key="`${country.code}-${lang.code}`"
										class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
										:disabled="isLoading"
										@click="selectLanguage(country, lang)"
									>
										<span>{{ lang.name }}</span>
										<span
											v-if="currentCountry?.code === country.code && currentLanguage?.code === lang.code"
											class="text-blue-600"
										>
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</span>
										<span v-else-if="isLoading" class="text-gray-400">
											<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												></circle>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Mobile Menu Button -->
				<button
					class="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
					aria-label="Toggle menu"
					@click="mobileMenuOpen = !mobileMenuOpen"
				>
					<svg
						v-if="!mobileMenuOpen"
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
					<svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Mobile Navigation -->
			<div v-if="mobileMenuOpen" class="border-t border-gray-200 py-4 md:hidden">
				<nav class="flex flex-col gap-2" aria-label="Mobile navigation">
					<LocalizedLink
						to="/"
						class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
						@click="mobileMenuOpen = false"
					>
						{{ t("nav.home") }}
					</LocalizedLink>
					<LocalizedLink
						to="/events"
						class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
						@click="mobileMenuOpen = false"
					>
						{{ t("nav.events") }}
					</LocalizedLink>

					<!-- Mobile Language Selector -->
					<div class="mt-4 border-t border-gray-200 pt-4">
						<div class="mb-2 px-3 text-xs font-semibold text-gray-500">Language & Country</div>
						<div class="space-y-1">
							<div v-for="country in countries" :key="country.code" class="mb-3">
								<div class="px-3 py-1 text-xs font-medium text-gray-400">
									{{ country.flag }} {{ country.name }}
								</div>
								<button
									v-for="lang in country.languages"
									:key="`${country.code}-${lang.code}`"
									class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
									:disabled="isLoading"
									@click="
										selectLanguage(country, lang);
										mobileMenuOpen = false;
									"
								>
									<span>{{ lang.name }}</span>
									<span
										v-if="currentCountry?.code === country.code && currentLanguage?.code === lang.code"
										class="text-blue-600"
									>
										<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</span>
									<span v-else-if="isLoading" class="text-gray-400">
										<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									</span>
								</button>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false);
const dropdownOpen = ref(false);

const { t } = useI18n(); // Use i18n translation function
const { currentCountry, currentLanguage, countries, switchLanguage } = useMultiLocale();
const { isLoading, startLoading, stopLoading } = useLanguageLoading();

// Check if current language is RTL
const isRTL = computed(() => currentLanguage.value?.code === "ar");

// Function to select language
type Country = {
	code: string;
	flag: string;
	name: string;
	languages: Language[];
};

type Language = {
	code: string;
	name: string;
};

const selectLanguage = async (country: Country, language: Language) => {
	dropdownOpen.value = false;
	mobileMenuOpen.value = false;

	// Start loading state
	startLoading();

	try {
		// Fix: Ensure we provide a Country object matching the config Country type (with defaultLang property)
		const countryWithDefaultLang = {
			...country,
			defaultLang: country.languages[0]?.code || "", // fallback to first language as defaultLang
		};

		await switchLanguage(countryWithDefaultLang, language);

		// Add a small delay to show the loading state
		await new Promise(resolve => setTimeout(resolve, 500));
	} catch (error) {
		console.error("Language switch failed:", error);
	} finally {
		// Stop loading state
		stopLoading();
	}
};

// Close dropdown when clicking outside
if (import.meta.client) {
	onMounted(() => {
		document.addEventListener("click", e => {
			const target = e.target as HTMLElement;
			if (!target.closest(".relative")) {
				dropdownOpen.value = false;
			}
		});
	});
}
</script>
