import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },

	// Development mode configuration
	dev: process.env.NODE_ENV === "development",

	modules: ["@nuxt/eslint", "@nuxtjs/i18n", "@nuxt/ui", "@nuxtjs/seo"],

	alias: {
		"@": resolve(process.cwd(), "."),
	},

	// SPA mode configuration
	ssr: true,

	// i18n configuration
	i18n: {
		locales: [
			{ code: "en", language: "en-US", name: "English", file: "en.json" },
			{ code: "ar", language: "ar-SA", name: "Arabic", file: "ar.json", dir: "rtl" },
			{ code: "fr", language: "fr-FR", name: "French", file: "fr.json" },
			{ code: "de", language: "de-DE", name: "German", file: "de.json" },
			{ code: "es", language: "es-ES", name: "Spanish", file: "es.json" },
		],
		defaultLocale: "en",
		strategy: "no_prefix",
		langDir: "locales",
		detectBrowserLanguage: false,
		compilation: {
			strictMessage: false,
		},
	},

	// Tailwind CSS configuration
	css: [
		"@/assets/css/main.css"
	],

		vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: true,
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["vue", "vue-router"],
						i18n: ["@nuxtjs/i18n"],
						ui: ["@nuxt/ui"],
					},
				},
			},
		},
		optimizeDeps: {
			include: ["vue", "vue-router"],
		},
		ssr: {
			noExternal: ["@nuxt/ui"],
		},
	},

	// Performance optimizations
	experimental: {
		payloadExtraction: false,
		typedPages: true,
		watcher: "chokidar-granular",
	},

	// Build optimizations for TBT
	build: {
		transpile: [],
	},

	// App configuration for performance
	app: {
		head: {
			link: [
				// Preconnect to external domains for faster loading
				{ rel: "preconnect", href: "https://ipapi.co" },
				{ rel: "dns-prefetch", href: "https://ipapi.co" },
			],
		},
	},

	// SEO Configuration
	site: {
		url: process.env.NUXT_PUBLIC_SITE_URL || "https://yourwebsite.com",
		name: "Multi-Region Multi-Language App",
		description:
			"A multi-region and multi-language website supporting various countries and languages",
		defaultLocale: "en",
	},

	// Sitemap Configuration
	sitemap: {
		enabled: true,
		strictNuxtContentPaths: true,
		xsl: false,
		// Include all country/language combinations
		urls: async () => {
			const countries = ["in", "ae", "sa", "us", "gb", "fr", "de", "es"];
			const languageMappings: Record<string, string[]> = {
				in: ["en"],
				ae: ["ar", "en"],
				sa: ["ar", "en"],
				us: ["en"],
				gb: ["en"],
				fr: ["fr", "en"],
				de: ["de", "en"],
				es: ["es", "en"],
			};

			const urls: Array<{
				loc: string;
				alternates?: Array<{ hreflang: string; href: string }>;
			}> = [];

			countries.forEach(country => {
				const languages = languageMappings[country] || ["en"];
				const defaultLang =
					country === "ae" || country === "sa"
						? "ar"
						: country === "fr"
							? "fr"
							: country === "de"
								? "de"
								: country === "es"
									? "es"
									: "en";

				languages.forEach(lang => {
					const isDefault = lang === defaultLang;
					const path = isDefault ? `/${country}` : `/${country}/${lang}`;

					// Build alternates for this page
					const alternates = languages.map(altLang => ({
						hreflang:
							altLang === "en"
								? "en-US"
								: altLang === "ar"
									? "ar-SA"
									: altLang === "fr"
										? "fr-FR"
										: altLang === "de"
											? "de-DE"
											: "es-ES",
						href: `${process.env.NUXT_PUBLIC_SITE_URL || "https://yourwebsite.com"}${altLang === defaultLang ? `/${country}` : `/${country}/${altLang}`}`,
					}));

					urls.push({
						loc: path,
						alternates,
					});
				});
			});

			return urls;
		},
	},

	// Robots Configuration
	robots: {
		enabled: true,
		disallow: [],
		sitemap: `${process.env.NUXT_PUBLIC_SITE_URL || "https://yourwebsite.com"}/sitemap.xml`,
	},

	// Security headers including CSP and Performance headers
	nitro: {
		compressPublicAssets: true,
		routeRules: {
			// Homepage - ISR with revalidation
			"/": {
				prerender: false,
				headers: {
					"Cache-Control": "public, max-age=60, must-revalidate",
				},
			},
			// Country/lang routes - ISR with longer cache
			"/**": {
				headers: {
					"X-Content-Type-Options": "nosniff",
					"X-Frame-Options": "DENY",
					"X-XSS-Protection": "1; mode=block",
					"Referrer-Policy": "strict-origin-when-cross-origin",
					"Permissions-Policy": "geolocation=(), microphone=(), camera=()",
					"Cache-Control": "public, max-age=300, stale-while-revalidate=600",
					"Content-Security-Policy":
						process.env.NODE_ENV === "development"
							? [
									// More permissive CSP for development
									"default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob:",
									"script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' data: blob:",
									"style-src 'self' 'unsafe-inline' 'unsafe-hashes' data: blob:",
									"img-src 'self' data: https: blob:",
									"font-src 'self' data: blob:",
									"connect-src 'self' https: ws: wss: data: blob: https://ipapi.co",
									"object-src 'none'",
									"base-uri 'self'",
									"form-action 'self'",
									"frame-src 'self'",
								].join("; ")
							: [
									// Production CSP (more restrictive)
									"default-src 'self'",
									"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
									"style-src 'self' 'unsafe-inline'",
									"img-src 'self' data: https:",
									"font-src 'self' data:",
									"connect-src 'self' https://ipapi.co",
									"object-src 'none'",
									"base-uri 'self'",
									"form-action 'self'",
								].join("; "),
				},
			},
			// Static assets - long cache
			"/_nuxt/**": {
				headers: {
					"Cache-Control": "public, max-age=31536000, immutable",
				},
			},
			// Locale files - cache
			"/i18n/**": {
				headers: {
					"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				},
			},
		},
	},
});
