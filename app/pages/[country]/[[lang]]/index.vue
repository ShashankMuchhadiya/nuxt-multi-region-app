<template>
	<div>
		<section class="bg-gradient-to-b from-blue-50 to-white py-20">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-4xl text-center">
					<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl leading-16">
						{{ t("home.title") }} <br />
						in {{ currentCountry?.name ?? "Unknown" }} ({{ currentLanguage?.name ?? "Default" }})
					</h1>
					<p class="text-lg text-gray-600">
						{{ t("home.subtitle") }}
					</p>
					<div class="mt-8 flex justify-center gap-4">
						<LocalizedLink
							to="/events"
							class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
						>
							{{ t("nav.events") }}
						</LocalizedLink>
					</div>
				</div>
			</div>
		</section>

		<AboutUs />
	</div>
</template>

<script setup lang="ts">
const { t } = useI18n(); // Use i18n translation function
const { currentCountry, currentLanguage } = useMultiLocale();

// SEO Configuration
useSEO({
	title: `${t("home.title")} - ${currentCountry.value?.name ?? "Unknown"}`,
	description: t("home.subtitle"),
	keywords: "home, multi-language, multi-region, international website",
	type: "website",
});

// Structured Data for Organization
const { setOrganizationSchema, setWebPageSchema } = useStructuredData();

setOrganizationSchema({
	name: "Multi-Region Multi-Language App",
	socialLinks: [
		// Add your social media links here
		// "https://twitter.com/yourcompany",
		// "https://linkedin.com/company/yourcompany",
	],
});

setWebPageSchema({
	title: `${t("home.title")} - ${currentCountry.value?.name ?? "Unknown"}`,
	description: t("home.subtitle"),
	language:
		currentLanguage.value?.code === "en"
			? "en-US"
			: `${currentLanguage.value?.code}-${currentCountry.value?.code.toUpperCase()}`,
});
</script>
