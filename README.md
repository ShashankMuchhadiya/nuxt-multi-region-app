# Nuxt Multi-Region, Multi-Language App

This project is a Nuxt 4 app that supports multiple regions and languages with SEO best practices, CSP security headers, and performance tuning. It includes dynamic country/language routing, i18n, sitemaps/robots, and bundle analysis.

## Key Features

- Internationalization (i18n) with lazy-loaded locales (`@nuxtjs/i18n`).
- Country and language-aware routing under `pages/[country]/[[lang]]/...`.
- SEO toolkit (`@nuxtjs/seo`) with site metadata, sitemap and robots.
- CSP and security headers via Nitro `routeRules`.
- Tailwind via Vite plugin (`@tailwindcss/vite`).
- Performance optimizations (manual chunks, long-term caching for `/_nuxt/**`).
- Sonda bundle analyzer integration (`sonda/nuxt`).
- Rate limiting middleware (server-side example).

## Project Structure Overview

- `app/pages/[country]/[[lang]]`
  - Routes like `/in`, `/in/en`, `/ae`, `/ae/ar`, etc.
  - Nested routes for resources (e.g., `events/[slug]`).
- `app/components/*`
  - UI components (Header, Footer, LocalizedLink, etc.).
- `app/composables/*`
  - `useLocale.ts`: locale helpers
  - `useSEO.ts` and `useStructuredData.ts`: page meta/JSON-LD
  - `useGeolocation.ts`: geolocation utility
- `plugins/*`
  - `html-lang.client.ts`/`server.ts`: set `<html lang>` attribute
  - `locale-sync.*.ts`: sync locale
  - `geolocation-redirect.client.ts`: optional client redirect logic
- `server/middleware/rate-limit.ts`
  - Example rate-limiting for server routes
- `nuxt.config.ts`
  - Centralized config (modules, i18n, SEO, CSP, Nitro headers, etc.)

## Routing and i18n

- i18n locales in `i18n/locales/*.json` (en, ar, fr, de, es).
- Strategy is `no_prefix` (language inferred per route context) with explicit region/language in URLs.
- Example URLs:
  - Default language for region: `/fr` → French
  - Alternate language within region: `/fr/en`

## SEO and Metadata

- `site` config in `nuxt.config.ts` defines:
  - `url`: base site URL (defaults to `https://nuxt-multi-region-app.vercel.app`, override via `NUXT_PUBLIC_SITE_URL`).
  - `name`, `description`, `defaultLocale`.
- Sitemap is generated with country/language alternates.
- Schema.org structured data is generated for each page.
- Ld-json for the page is generated for each page.
- Robots includes the sitemap URL.
- Composable-based SEO: useSEO() composable for page metadata
- Canonical URLs: Proper canonical URL
- Hreflang tags: Alternate language links for all language variants
- X-default: Proper x-default hreflang implementation
- Open Graph tags: Complete OG metadata (title, description, image, type, locale)
- Twitter Cards: Twitter card metadata support
- Robots meta: Proper robots directives (index, follow or noindex for errors)
- Structured data (Schema.org)
- JSON-LD structured data: Organization, WebPage, Event, BreadcrumbList schemas
- Type-safe schemas: Proper TypeScript interfaces for schemas
- Composable pattern: useStructuredData() for easy implementation

## Security Headers and CSP

All headers are managed under `nitro.routeRules` in `nuxt.config.ts`.

- Development CSP is permissive to ease debugging.
- Production CSP is restrictive but allows inline scripts for framework bootstrap:
  - `script-src 'self' 'unsafe-inline'`
- `connect-src` allows `https://ipapi.co` and your Vercel domain `https://nuxt-multi-region-app.vercel.app`.
- Additional security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, etc.

If you need a stricter CSP, consider nonce- or hash-based policies.

## Performance and Build

- Vite manual chunks to split `vendor` (Vue, vue-router).
- Long cache headers for `/_nuxt/**` and reasonable SWR for pages.
- `@tailwindcss/vite` for Tailwind processing.

## Bundle Analysis (Sonda)

Sonda is integrated via `Sonda({ server: true })` in `modules`.
generation
CLI usage to analyze built client assets (optional, if you want a standalone report):

```bash
# Ensure sourcemaps if you plan to analyze from files directly
NUXT_VITE_SOURCEMAP=true npm run build

# Analyze client assets from Nuxt output
npx sonda analyze .output/public/_nuxt --out sonda-report.html
```

Open the report:

```bash
xdg-open sonda-report.html
```

## Environment Variables

- `NUXT_PUBLIC_SITE_URL` (recommended in production): overrides canonical base URL.
- `IPAPI_KEY` (optional): used by geolocation utility if required.

Set these in Vercel Project Settings → Environment Variables.

## Scripts

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run preview   # Preview the production build locally
```

## Deployment

- Default deployment target: Vercel (`nuxt-multi-region-app.vercel.app`).
- Ensure `NUXT_PUBLIC_SITE_URL` is set to your production URL to keep SEO links canonical.

## Local Development

```bash
npm install
npm run dev
```

## Notes and Troubleshooting

- Inline script CSP errors: we allow `'unsafe-inline'` in production to enable Nuxt bootstrap. For stricter CSP, implement a nonce-based policy.
- If you see `@oxc-parser/binding-wasm32-wasi` resolve errors locally, clear lockfile and reinstall or ensure your Node and platform match the prebuilt binaries requirements.

---

For Nuxt specifics, see the official [Nuxt docs](https://nuxt.com/docs/getting-started/introduction).
