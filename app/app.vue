<template>
	<div v-if="isLoading" class="fixed inset-0 z-50 bg-white">
		<LanguageSkeleton />
	</div>
	<div v-else>
		<Header />
		<main>
			<NuxtPage />
		</main>
		<Footer />
	</div>
</template>

<script setup lang="ts">
const { isLoading } = useLanguageLoading();

// Base SEO configuration
useHead({
	titleTemplate: "%s | Multi-Region Multi-Language App",
	meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
});
</script>
