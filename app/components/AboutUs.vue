<template>
	<section class="bg-gray-100 py-12">
		<div class="container mx-auto px-4">
			<h2 class="mb-4 text-3xl font-bold text-gray-900">{{ t("about.title") }}</h2>
			<p class="mb-6 text-lg text-gray-700">
				{{ t("about.description") }}
			</p>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h3 class="mb-2 text-xl font-semibold text-gray-900">{{ t("about.mission") }}</h3>
					<p class="text-gray-600">{{ t("about.missionText") }}</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { t } = useI18n(); // Use i18n translation function
</script>
