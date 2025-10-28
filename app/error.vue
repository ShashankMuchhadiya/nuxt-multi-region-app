<template>
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="mx-auto max-w-2xl px-4 text-center">
			<h1 class="mb-4 text-9xl font-bold text-gray-800">{{ error?.statusCode }}</h1>
			<h2 class="mb-4 text-3xl font-semibold text-gray-700">{{ errorTitle }}</h2>
			<p class="mb-8 text-lg text-gray-600">{{ errorMessage }}</p>
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<LocalizedLink
					to="/"
					class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					{{ backHomeText }}
				</LocalizedLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
	error: {
		type: Object as () => NuxtError,
		default: () => ({ statusCode: 404, statusMessage: "Page Not Found" }),
	},
});

const { currentLanguage } = useMultiLocale();

// Error page translations
const errorTitles: Record<number, Record<string, string>> = {
	404: {
		en: "Page Not Found",
		ar: "الصفحة غير موجودة",
		fr: "Page non trouvée",
		de: "Seite nicht gefunden",
		es: "Página no encontrada",
	},
	500: {
		en: "Server Error",
		ar: "خطأ في الخادم",
		fr: "Erreur du serveur",
		de: "Serverfehler",
		es: "Error del servidor",
	},
};

const errorMessages: Record<number, Record<string, string>> = {
	404: {
		en: "Sorry, the page you are looking for doesn't exist or has been moved.",
		ar: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
		fr: "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
		de: "Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.",
		es: "Lo sentimos, la página que buscas no existe o ha sido movida.",
	},
	500: {
		en: "Something went wrong on our end. Please try again later.",
		ar: "حدث خطأ ما من جانبنا. يرجى المحاولة مرة أخرى لاحقاً.",
		fr: "Quelque chose s'est mal passé de notre côté. Veuillez réessayer plus tard.",
		de: "Auf unserer Seite ist etwas schief gelaufen. Bitte versuchen Sie es später erneut.",
		es: "Algo salió mal de nuestra parte. Por favor, inténtalo de nuevo más tarde.",
	},
};

const backHomeTexts: Record<string, string> = {
	en: "Back to Home",
	ar: "العودة إلى الصفحة الرئيسية",
	fr: "Retour à l'accueil",
	de: "Zurück zur Startseite",
	es: "Volver al inicio",
};

const errorTitle = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const statusCode = props.error?.statusCode || 404;
	const titles = errorTitles[statusCode] ?? errorTitles[404] ?? {};
	return titles?.[lang] ?? titles?.en ?? "Error";
});

const errorMessage = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const statusCode = props.error?.statusCode || 404;
	const messages = errorMessages?.[statusCode] ?? errorMessages?.[404] ?? {};
	return messages?.[lang] ?? messages?.en ?? "An error occurred.";
});

const backHomeText = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	return backHomeTexts[lang] || backHomeTexts.en;
});

// SEO for error pages - prevent indexing
useHead({
	title: errorTitle.value,
	meta: [
		{ name: "robots", content: "noindex, nofollow" },
		{ name: "description", content: errorMessage.value },
	],
});
</script>
