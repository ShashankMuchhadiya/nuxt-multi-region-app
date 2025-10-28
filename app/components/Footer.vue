<template>
	<footer class="border-t border-gray-200 bg-white">
		<div class="container mx-auto px-4 py-12">
			<!-- Main Footer Content -->
			<div class="grid gap-8 md:grid-cols-3">
				<!-- Brand Section -->
				<div class="md:col-span-2">
					<div class="mb-4 flex items-center gap-2">
						<span class="text-lg font-semibold text-gray-900">Multi Region Demo App</span>
					</div>
					<p class="mb-4 text-sm text-gray-600">
						Building amazing web experiences with Nuxt and Tailwind CSS.
					</p>
				</div>

				<!-- Quick Links -->
				<div>
					<h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t("footer.quickLinks") }}</h3>
					<ul class="space-y-2">
						<li>
							<LocalizedLink to="/" class="text-sm text-gray-600 hover:text-gray-900">
								{{ t("nav.home") }}
							</LocalizedLink>
						</li>
						<li>
							<LocalizedLink to="/events" class="text-sm text-gray-600 hover:text-gray-900">
								{{ t("nav.events") }}
							</LocalizedLink>
						</li>
					</ul>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div class="mt-8 border-t border-gray-200 pt-8">
				<p class="text-center text-sm text-gray-600">
					&copy; {{ new Date().getFullYear() }} Multi Region Demo App. {{ t("footer.rights") }}.
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
const { t } = useI18n(); // Use i18n translation function
</script>
