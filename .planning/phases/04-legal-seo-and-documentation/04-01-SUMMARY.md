---
phase: 04-legal-seo-and-documentation
plan: 01
subsystem: seo, legal
tags: [astro-sitemap, open-graph, twitter-card, meta-tags, robots-txt, llms-txt, prose-css, legal-pages]

# Dependency graph
requires:
  - phase: 01-foundation-and-chrome
    provides: BaseLayout.astro, global.css, astro.config.mjs
provides:
  - Extended BaseLayout with SEO props (description, ogImage, ogType, canonicalURL) and OG/Twitter meta tags
  - Full privacy policy page at /privacy with 12 legal sections
  - Full terms of service page at /terms with 17 legal sections
  - Build-time sitemap generation via @astrojs/sitemap (5 pages)
  - robots.txt with sitemap reference
  - llms.txt for AI-agent discoverability with MCP server mention
  - prose-legal CSS utility class for legal page typography
affects: [04-02, 04-03]

# Tech tracking
tech-stack:
  added: ["@astrojs/sitemap"]
  patterns: [BaseLayout SEO props with defaults, dark Gunmetal header band for utility pages, prose-legal typography class]

key-files:
  created: [public/robots.txt, public/llms.txt]
  modified: [src/layouts/BaseLayout.astro, astro.config.mjs, src/styles/global.css, src/pages/privacy.astro, src/pages/terms.astro]

key-decisions:
  - "prose-legal custom CSS class instead of @tailwindcss/typography -- lighter, more controlled for legal pages"
  - "OG image URLs computed as absolute via new URL(ogImage, Astro.site).href for social crawler compatibility"
  - "Named head slot in BaseLayout for page-specific JSON-LD injection in Plan 02"

patterns-established:
  - "BaseLayout SEO props: all pages pass description/ogImage/ogType/canonicalURL with sensible defaults"
  - "Legal page layout: dark Gunmetal header band (pt-28 pb-10) + prose-legal article section"
  - "prose-legal class: 65ch max-width, 1.75 line-height, molten-orange links"

requirements-completed: [LEGL-01, LEGL-02, PERF-07]

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 4 Plan 01: SEO Infrastructure and Legal Pages Summary

**Extended BaseLayout with OG/Twitter meta tags, added @astrojs/sitemap for 5-page sitemap, created robots.txt and llms.txt, and converted fierro_web legal content to full privacy and terms pages with prose-legal styling**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-10T04:22:24Z
- **Completed:** 2026-03-10T04:26:11Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- BaseLayout now renders meta description, OG tags, and Twitter card tags on every page with sensible defaults
- Privacy page renders full legal content (12 sections) converted from fierro_web with dark Gunmetal header band
- Terms page renders full legal content (17 sections) converted from fierro_web with dark Gunmetal header band
- Sitemap generates at build time with all 5 pages via @astrojs/sitemap integration
- robots.txt and llms.txt serve correctly from public/ with sitemap reference and MCP mention

## Task Commits

Each task was committed atomically:

1. **Task 1: SEO infrastructure -- BaseLayout extension, sitemap, robots.txt, llms.txt, prose-legal CSS** - `7552eef` (feat)
2. **Task 2: Legal pages -- convert privacy and terms content from fierro_web** - `7f8f5e6` (feat)

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Extended Props interface with description, ogImage, ogType, canonicalURL; added OG/Twitter meta tags and head slot
- `astro.config.mjs` - Added @astrojs/sitemap integration import and configuration
- `src/styles/global.css` - Added prose-legal utility class for legal page typography
- `public/robots.txt` - Search engine directives with sitemap-index.xml reference
- `public/llms.txt` - AI-agent discoverability file with page descriptions and MCP server mention
- `src/pages/privacy.astro` - Full privacy policy page (294 lines) with 12 sections, dark header band, prose-legal styling
- `src/pages/terms.astro` - Full terms of service page (312 lines) with 17 sections, dark header band, prose-legal styling

## Decisions Made
- Used prose-legal custom CSS class instead of @tailwindcss/typography plugin -- lighter weight and more controlled for the specific legal page layout
- OG image URLs computed as absolute paths via `new URL(ogImage, Astro.site).href` to ensure social crawlers can resolve them
- Added named `<slot name="head" />` in BaseLayout for page-specific JSON-LD injection (used by Plan 02)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- BaseLayout SEO props available for Plan 02 to add page-specific meta descriptions and JSON-LD structured data
- Head slot ready for JSON-LD injection on home page
- Legal pages complete and linked from existing Footer component

## Self-Check: PASSED

All 7 files verified present. Both task commits (7552eef, 7f8f5e6) verified in git log.

---
*Phase: 04-legal-seo-and-documentation*
*Completed: 2026-03-09*
