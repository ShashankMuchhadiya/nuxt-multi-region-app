interface OrganizationSchema {
	"@context": string;
	"@type": string;
	name: string;
	url: string;
	logo?: string;
	sameAs?: string[];
}

interface WebPageSchema {
	"@context": string;
	"@type": string;
	name: string;
	description?: string;
	url: string;
	inLanguage: string;
}

interface EventSchema {
	"@context": string;
	"@type": string;
	name: string;
	description?: string;
	startDate?: string;
	endDate?: string;
	location?: {
		"@type": string;
		name: string;
		address?: string;
	};
	organizer?: {
		"@type": string;
		name: string;
		url?: string;
	};
}

export const useStructuredData = () => {
	const route = useRoute();
	const config = useRuntimeConfig();
	const siteUrl = config.public.siteUrl || "https://yourwebsite.com";

	/**
	 * Add Organization structured data
	 */
	const setOrganizationSchema = (options: {
		name: string;
		logo?: string;
		socialLinks?: string[];
	}) => {
		const schema: OrganizationSchema = {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: options.name,
			url: siteUrl,
			logo: options.logo || `${siteUrl}/logo.png`,
			sameAs: options.socialLinks || [],
		};

		useHead({
			script: [
				{
					type: "application/ld+json",
					children: JSON.stringify(schema),
				},
			],
		});
	};

	/**
	 * Add WebPage structured data
	 */
	const setWebPageSchema = (options: { title: string; description?: string; language?: string }) => {
		const schema: WebPageSchema = {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: options.title,
			description: options.description,
			url: `${siteUrl}${route.path}`,
			inLanguage: options.language || "en-US",
		};

		useHead({
			script: [
				{
					type: "application/ld+json",
					children: JSON.stringify(schema),
				},
			],
		});
	};

	/**
	 * Add Event structured data
	 */
	const setEventSchema = (options: {
		name: string;
		description?: string;
		startDate?: string;
		endDate?: string;
		locationName?: string;
		locationAddress?: string;
		organizerName?: string;
		organizerUrl?: string;
	}) => {
		const schema: EventSchema = {
			"@context": "https://schema.org",
			"@type": "Event",
			name: options.name,
			description: options.description,
			startDate: options.startDate,
			endDate: options.endDate,
			location: options.locationName
				? {
						"@type": "Place",
						name: options.locationName,
						address: options.locationAddress,
					}
				: undefined,
			organizer: options.organizerName
				? {
						"@type": "Organization",
						name: options.organizerName,
						url: options.organizerUrl,
					}
				: undefined,
		};

		useHead({
			script: [
				{
					type: "application/ld+json",
					children: JSON.stringify(schema),
				},
			],
		});
	};

	/**
	 * Add BreadcrumbList structured data
	 */
	const setBreadcrumbSchema = (
		breadcrumbs: Array<{ name: string; path: string; position: number }>
	) => {
		const schema = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbs.map(crumb => ({
				"@type": "ListItem",
				position: crumb.position,
				name: crumb.name,
				item: `${siteUrl}${crumb.path}`,
			})),
		};

		useHead({
			script: [
				{
					type: "application/ld+json",
					children: JSON.stringify(schema),
				},
			],
		});
	};

	return {
		setOrganizationSchema,
		setWebPageSchema,
		setEventSchema,
		setBreadcrumbSchema,
	};
};
