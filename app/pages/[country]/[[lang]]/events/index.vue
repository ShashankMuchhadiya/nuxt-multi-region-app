<template>
	<div class="container mx-auto px-4 py-12">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">
			{{ t("events.listTitle") }} in {{ currentCountry?.name ?? "Unknown" }} ({{
				currentLanguage?.name ?? "Default"
			}})
		</h1>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<LocalizedLink
				v-for="event in events"
				:key="event.id"
				:to="`/events/${event.slug}`"
				class="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
			>
				<h2 class="mb-2 text-xl font-semibold text-gray-900">{{ event.title }}</h2>
				<p class="text-gray-600">{{ event.description }}</p>
				<p class="mt-4 text-sm text-blue-600">{{ event.date }}</p>
			</LocalizedLink>
		</div>

		<p v-if="events.length === 0" class="text-center text-gray-500">
			{{ t("events.noEvents") }}
		</p>
	</div>
</template>

<script setup lang="ts">
const { t } = useI18n(); // Use i18n translation function
const { currentLanguage, currentCountry } = useMultiLocale();

// Define supported language codes type
type SupportedLanguage = "en" | "ar" | "fr" | "de" | "es";

// Event translations for all languages
const eventTranslations = {
	"tech-conference-2025": {
		title: {
			en: "Tech Conference 2025",
			ar: "مؤتمر التكنولوجيا 2025",
			fr: "Conférence technologique 2025",
			de: "Technologiekonferenz 2025",
			es: "Conferencia de Tecnología 2025",
		},
		description: {
			en: "Join us for the biggest tech conference",
			ar: "انضم إلينا في أكبر مؤتمر تقني",
			fr: "Rejoignez-nous pour la plus grande conférence technologique",
			de: "Begleiten Sie uns zur größten Tech-Konferenz",
			es: "Únete a nosotros en la mayor conferencia tecnológica",
		},
	},
	"web-development-workshop": {
		title: {
			en: "Web Development Workshop",
			ar: "ورشة تطوير الويب",
			fr: "Atelier de développement Web",
			de: "Webentwicklungs-Workshop",
			es: "Taller de Desarrollo Web",
		},
		description: {
			en: "Learn the latest web technologies",
			ar: "تعلم أحدث تقنيات الويب",
			fr: "Apprenez les dernières technologies web",
			de: "Lernen Sie die neuesten Web-Technologien",
			es: "Aprende las últimas tecnologías web",
		},
	},
	"design-summit": {
		title: {
			en: "Design Summit",
			ar: "قمة التصميم",
			fr: "Sommet du design",
			de: "Design-Gipfel",
			es: "Cumbre de Diseño",
		},
		description: {
			en: "Explore new design trends",
			ar: "استكشف اتجاهات التصميم الجديدة",
			fr: "Explorez les nouvelles tendances du design",
			de: "Entdecken Sie neue Designtrends",
			es: "Explora las nuevas tendencias de diseño",
		},
	},
};

// Mock events data with multi-language support
const events = computed(() => {
	const lang = (currentLanguage.value?.code ?? "en") as SupportedLanguage;

	return [
		{
			id: 1,
			slug: "tech-conference-2025",
			title:
				eventTranslations["tech-conference-2025"].title[lang] ||
				eventTranslations["tech-conference-2025"].title.en,
			description:
				eventTranslations["tech-conference-2025"].description[lang] ||
				eventTranslations["tech-conference-2025"].description.en,
			date: "March 15, 2025",
		},
		{
			id: 2,
			slug: "web-development-workshop",
			title:
				eventTranslations["web-development-workshop"].title[lang] ||
				eventTranslations["web-development-workshop"].title.en,
			description:
				eventTranslations["web-development-workshop"].description[lang] ||
				eventTranslations["web-development-workshop"].description.en,
			date: "April 10, 2025",
		},
		{
			id: 3,
			slug: "design-summit",
			title:
				eventTranslations["design-summit"].title[lang] || eventTranslations["design-summit"].title.en,
			description:
				eventTranslations["design-summit"].description[lang] ||
				eventTranslations["design-summit"].description.en,
			date: "May 5, 2025",
		},
	];
});

// SEO Configuration
useSEO({
	title: `${t("events.listTitle")} - ${currentCountry.value?.name ?? "Unknown"}`,
	description: "Browse upcoming events and conferences in your region",
	keywords: "events, conferences, workshops, tech events, design events",
	type: "website",
});
</script>
