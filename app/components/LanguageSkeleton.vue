<template>
	<div class="language-skeleton">
		<!-- Header skeleton -->
		<div class="flex h-16 items-center justify-between px-4">
			<!-- Logo skeleton -->
			<div class="flex items-center gap-2">
				<USkeleton class="h-6 w-48" />
			</div>

			<!-- Navigation skeleton -->
			<div class="flex items-center gap-6">
				<!-- Desktop nav skeleton -->
				<div class="hidden items-center gap-6 md:flex">
					<USkeleton class="h-4 w-12" />
					<USkeleton class="h-4 w-16" />
				</div>

				<!-- Language selector skeleton -->
				<div class="hidden md:block">
					<USkeleton class="h-8 w-20" />
				</div>
			</div>

			<!-- Mobile menu button skeleton -->
			<div class="md:hidden">
				<USkeleton class="h-8 w-8" />
			</div>
		</div>

		<!-- Content skeleton -->
		<div class="container mx-auto px-4 py-8">
			<!-- Page title skeleton -->
			<div class="mb-8 text-center">
				<USkeleton class="mx-auto h-8 w-64 mb-4" />
				<USkeleton class="mx-auto h-4 w-96" />
			</div>

			<!-- Content blocks skeleton -->
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div v-for="i in 6" :key="i" class="rounded-lg border p-6">
					<USkeleton class="h-4 w-3/4 mb-2" />
					<USkeleton class="h-3 w-full mb-2" />
					<USkeleton class="h-3 w-2/3" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// This component uses Nuxt UI's USkeleton component
// It provides a loading state while language switching occurs
</script>

<style scoped>
.language-skeleton {
	min-height: 100vh;
	background-color: #f9fafb;
}
</style>
