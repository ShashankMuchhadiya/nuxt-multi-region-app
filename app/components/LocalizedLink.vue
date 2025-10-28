<template>
	<NuxtLink :to="localizedHref" v-bind="$attrs">
		<slot />
	</NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
	to: string;
}>();

const { localePath } = useMultiLocale();

// Convert the "to" prop to a localized path
const localizedHref = computed(() => {
	// If the link is to root ("/"), use empty string for localePath
	if (props.to === "/") {
		return localePath("");
	}

	// Remove leading slash if present
	const path = props.to.startsWith("/") ? props.to.slice(1) : props.to;

	// Use localePath to generate the correct localized URL
	return localePath(path);
});
</script>
