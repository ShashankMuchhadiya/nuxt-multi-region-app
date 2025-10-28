export const useLanguageLoading = () => {
	const isLoading = ref(false);
	const loadingTimeout = ref<NodeJS.Timeout | null>(null);

	const startLoading = () => {
		isLoading.value = true;

		// Clear any existing timeout
		if (loadingTimeout.value) {
			clearTimeout(loadingTimeout.value);
		}

		// Set a maximum loading time to prevent infinite loading
		loadingTimeout.value = setTimeout(() => {
			isLoading.value = false;
		}, 3000); // 3 seconds max
	};

	const stopLoading = () => {
		isLoading.value = false;

		if (loadingTimeout.value) {
			clearTimeout(loadingTimeout.value);
			loadingTimeout.value = null;
		}
	};

	// Cleanup on unmount
	onUnmounted(() => {
		if (loadingTimeout.value) {
			clearTimeout(loadingTimeout.value);
		}
	});

	return {
		isLoading: readonly(isLoading),
		startLoading,
		stopLoading,
	};
};
