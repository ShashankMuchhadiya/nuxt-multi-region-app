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

// Base SEO configuration with performance optimizations
useHead({
	titleTemplate: "%s | Multi-Region Multi-Language App",
	meta: [
		{ charset: "utf-8" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		// Performance hints
		{ name: "format-detection", content: "telephone=no" },
	],
	htmlAttrs: {
		lang: "en",
	},
	link: [
		// Prefetch critical routes
		{ rel: "prefetch", href: "/in" },
		{ rel: "prefetch", href: "/in/events" },
	],
});
</script>

<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
