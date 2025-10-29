<template>
	<div class="container mx-auto px-4 py-12">
		<div class="mx-auto max-w-3xl">
			<LocalizedLink
				to="/events"
				class="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				{{ backButtonText }}
			</LocalizedLink>

			<h1 class="mb-4 text-4xl font-bold text-gray-900">
				{{ eventTitle }} in {{ currentCountry?.name ?? "Unknown" }} ({{
					currentLanguage?.name ?? "Default"
				}})
			</h1>
			<p class="mb-6 text-lg text-gray-600">{{ eventDescription }}</p>

			<div class="rounded-lg bg-gray-200 p-6">
				<h2 class="mb-2 text-xl font-semibold text-gray-900">{{ eventDetailsLabel }}</h2>
				<p class="text-gray-700">{{ eventSlugLabel }}: {{ slug }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const { currentLanguage, currentCountry } = useMultiLocale();

const slug = computed(() => {
	const routeParams = route.params as { slug?: string };
	return routeParams.slug || "";
});

// Event detail translations for all languages
const eventDetailTranslations: Record<
	string,
	Record<string, { title: string; description: string }>
> = {
	"tech-conference-2025": {
		en: {
			title: "Tech Conference 2025",
			description:
				"Join us for the biggest tech conference of the year. This comprehensive event brings together industry leaders, innovators, and tech enthusiasts from around the world to share insights and explore the future of technology.",
		},
		ar: {
			title: "مؤتمر التكنولوجيا 2025",
			description:
				"انضم إلينا في أكبر مؤتمر تقني للعام. يجمع هذا الحدث الشامل قادة الصناعة والمبتكرين وعشاق التكنولوجيا من جميع أنحاء العالم لتبادل الأفكار واستكشاف مستقبل التكنولوجيا.",
		},
		fr: {
			title: "Conférence technologique 2025",
			description:
				"Rejoignez-nous pour la plus grande conférence technologique de l'année. Cet événement complet réunit des leaders de l'industrie, des innovateurs et des passionnés de technologie du monde entier pour partager des idées et explorer l'avenir de la technologie.",
		},
		de: {
			title: "Technologiekonferenz 2025",
			description:
				"Begleiten Sie uns zur größten Tech-Konferenz des Jahres. Diese umfassende Veranstaltung bringt Branchenführer, Innovatoren und Tech-Enthusiasten aus der ganzen Welt zusammen, um Erkenntnisse auszutauschen und die Zukunft der Technologie zu erkunden.",
		},
		es: {
			title: "Conferencia de Tecnología 2025",
			description:
				"Únete a nosotros en la mayor conferencia tecnológica del año. Este evento integral reúne a líderes de la industria, innovadores y entusiastas de la tecnología de todo el mundo para compartir ideas y explorar el futuro de la tecnología.",
		},
	},
	"web-development-workshop": {
		en: {
			title: "Web Development Workshop",
			description:
				"Learn the latest web technologies and best practices in this hands-on workshop. Perfect for developers looking to enhance their skills with modern frameworks and tools.",
		},
		ar: {
			title: "ورشة تطوير الويب",
			description:
				"تعلم أحدث تقنيات الويب وأفضل الممارسات في هذه الورشة العملية. مثالية للمطورين الذين يتطلعون إلى تعزيز مهاراتهم باستخدام الأطر والأدوات الحديثة.",
		},
		fr: {
			title: "Atelier de développement Web",
			description:
				"Apprenez les dernières technologies web et les meilleures pratiques dans cet atelier pratique. Parfait pour les développeurs cherchant à améliorer leurs compétences avec des frameworks et outils modernes.",
		},
		de: {
			title: "Webentwicklungs-Workshop",
			description:
				"Lernen Sie die neuesten Web-Technologien und Best Practices in diesem praktischen Workshop. Perfekt für Entwickler, die ihre Fähigkeiten mit modernen Frameworks und Tools verbessern möchten.",
		},
		es: {
			title: "Taller de Desarrollo Web",
			description:
				"Aprende las últimas tecnologías web y mejores prácticas en este taller práctico. Perfecto para desarrolladores que buscan mejorar sus habilidades con frameworks y herramientas modernas.",
		},
	},
	"design-summit": {
		en: {
			title: "Design Summit",
			description:
				"Explore new design trends and connect with creative professionals. This summit showcases the latest in UI/UX design, branding, and digital creativity.",
		},
		ar: {
			title: "قمة التصميم",
			description:
				"استكشف اتجاهات التصميم الجديدة وتواصل مع المحترفين المبدعين. تعرض هذه القمة أحدث ما في تصميم واجهة المستخدم والعلامات التجارية والإبداع الرقمي.",
		},
		fr: {
			title: "Sommet du design",
			description:
				"Explorez les nouvelles tendances du design et connectez-vous avec des professionnels créatifs. Ce sommet présente les dernières nouveautés en matière de design UI/UX, de branding et de créativité numérique.",
		},
		de: {
			title: "Design-Gipfel",
			description:
				"Entdecken Sie neue Designtrends und vernetzen Sie sich mit kreativen Profis. Dieser Gipfel präsentiert das Neueste in UI/UX-Design, Branding und digitaler Kreativität.",
		},
		es: {
			title: "Cumbre de Diseño",
			description:
				"Explora las nuevas tendencias de diseño y conéctate con profesionales creativos. Esta cumbre muestra lo último en diseño UI/UX, branding y creatividad digital.",
		},
	},
};

// Get event details based on current language
const eventTitle = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const eventData = eventDetailTranslations[slug.value];
	return eventData?.[lang]?.title || eventData?.en?.title || slug.value;
});

const eventDescription = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const eventData = eventDetailTranslations[slug.value];
	return (
		eventData?.[lang]?.description || eventData?.en?.description || "Event description not available."
	);
});

// Back button text based on language
const backButtonText = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const texts: Record<string, string> = {
		en: "Back to Events",
		ar: "العودة إلى الفعاليات",
		fr: "Retour aux événements",
		de: "Zurück zu Veranstaltungen",
		es: "Volver a Eventos",
	};
	return texts[lang] || texts.en;
});

const eventDetailsLabel = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const labels: Record<string, string> = {
		en: "Event Details",
		ar: "تفاصيل الحدث",
		fr: "Détails de l'événement",
		de: "Veranstaltungsdetails",
		es: "Detalles del evento",
	};
	return labels[lang] || labels.en;
});

const eventSlugLabel = computed(() => {
	const lang = currentLanguage.value?.code ?? "en";
	const labels: Record<string, string> = {
		en: "Event Slug",
		ar: "معرف الحدث",
		fr: "Identifiant de l'événement",
		de: "Ereignis-ID",
		es: "ID del evento",
	};
	return labels[lang] || labels.en;
});

// SEO Configuration
useSEO({
	title: `${eventTitle.value} - ${currentCountry.value?.name ?? "Unknown"}`,
	description: eventDescription.value,
	keywords: `${eventTitle.value}, event, conference, workshop`,
	type: "article",
});

// Structured Data for Events
const { setEventSchema, setBreadcrumbSchema } = useStructuredData();

// Add Event structured data
setEventSchema({
	name: eventTitle.value,
	description: eventDescription.value,
	locationName: currentCountry.value?.name,
	organizerName: "Multi-Region Multi-Language App",
});

// Add Breadcrumb structured data
const { localePath } = useMultiLocale();
setBreadcrumbSchema([
	{ name: "Home", path: localePath("/"), position: 1 },
	{ name: "Events", path: localePath("/events"), position: 2 },
	{ name: eventTitle.value, path: localePath(`/events/${slug.value}`), position: 3 },
]);
</script>
