---
phase: 04-legal-seo-and-documentation
plan: 02
subsystem: seo, structured-data
tags: [og-images, json-ld, meta-descriptions, twitter-cards, playwright-tests, schema-org]

# Dependency graph
requires:
  - phase: 04-legal-seo-and-documentation
    plan: 01
    provides: BaseLayout with SEO props (description, ogImage, ogType, canonicalURL), head slot, legal pages, sitemap, robots.txt
provides:
  - 5 branded OG images (1200x630 PNG) at public/og/ for social sharing
  - Unique meta descriptions on all 5 pages (home, pricing, why-fierro, privacy, terms)
  - JSON-LD structured data on home page with Organization + SoftwareApplication schemas and 3 pricing tiers
  - 4 Playwright test files (71 tests) covering LEGL-01, LEGL-02, PERF-04, PERF-05, PERF-06, PERF-07
affects: [04-03]

# Tech tracking
tech-stack:
  added: [pngjs]
  patterns: [JSON-LD via set:html in named head slot, programmatic OG image generation, build-output sitemap testing]

key-files:
  created: [public/og/home.png, public/og/pricing.png, public/og/why-fierro.png, public/og/privacy.png, public/og/terms.png, scripts/generate-og-images.mjs, tests/legal.spec.ts, tests/seo-meta.spec.ts, tests/structured-data.spec.ts, tests/sitemap.spec.ts]
  modified: [src/pages/index.astro, src/pages/pricing.astro, src/pages/why-fierro.astro]

key-decisions:
  - "Pixel-font OG image generation with pngjs -- avoids native canvas dependencies while producing branded images with text"
  - "Sitemap tests verify build output (dist/) instead of dev server -- @astrojs/sitemap only generates at build time"

patterns-established:
  - "JSON-LD injection: use set:html={JSON.stringify(data)} on script[slot=head] to avoid Astro HTML escaping"
  - "OG images in public/og/ (not src/assets/) for stable, unhashed URLs that social crawlers can fetch"

requirements-completed: [PERF-04, PERF-05, PERF-06]

# Metrics
duration: 5min
completed: 2026-03-10
---

# Phase 4 Plan 02: Page-Specific SEO and Test Suite Summary

**Added unique meta descriptions, OG images, and JSON-LD structured data to all 5 pages, plus 71 Playwright tests covering legal pages, SEO meta tags, structured data, and sitemap**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-10T04:29:05Z
- **Completed:** 2026-03-10T04:34:21Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- All 5 pages now have unique meta descriptions and OG images for social sharing
- Home page includes JSON-LD with Organization + SoftwareApplication schemas with 3 pricing tiers and feature list
- 5 branded OG images (1200x630 PNG) generated programmatically with Gunmetal background, Molten Orange accents, and pixel-rendered text
- 71 new Playwright tests validate legal page content, SEO meta tags across all pages, JSON-LD structure, and sitemap build output

## Task Commits

Each task was committed atomically:

1. **Task 1: OG images, page-specific SEO props, and JSON-LD structured data** - `d5b3973` (feat)
2. **Task 2: Playwright test suite for phase 4 requirements** - `0bf592f` (test)

## Files Created/Modified
- `public/og/home.png` - Branded OG image for home page (6KB)
- `public/og/pricing.png` - Branded OG image for pricing page (6KB)
- `public/og/why-fierro.png` - Branded OG image for why-fierro page (5KB)
- `public/og/privacy.png` - Branded OG image for privacy page (5KB)
- `public/og/terms.png` - Branded OG image for terms page (5KB)
- `scripts/generate-og-images.mjs` - Node.js script for programmatic OG image generation with pixel font
- `src/pages/index.astro` - Added description, ogImage props and JSON-LD structured data via head slot
- `src/pages/pricing.astro` - Added description and ogImage props
- `src/pages/why-fierro.astro` - Added description and ogImage props
- `tests/legal.spec.ts` - 14 tests for LEGL-01, LEGL-02 (page content, header band, prose styling, contact emails)
- `tests/seo-meta.spec.ts` - 47 tests for PERF-04, PERF-05 (unique titles, descriptions, OG/Twitter tags, canonical URLs per page, uniqueness checks)
- `tests/structured-data.spec.ts` - 7 tests for PERF-06 (JSON-LD context, graph, Organization, SoftwareApplication, offers, featureList)
- `tests/sitemap.spec.ts` - 3 tests for PERF-07 (robots.txt Sitemap directive, sitemap-index.xml and sitemap-0.xml in build output)

## Decisions Made
- Used pngjs with a custom pixel font renderer for OG image generation instead of native canvas packages -- avoids platform-specific native dependency issues while still producing branded images with readable text
- Sitemap tests verify dist/ build output files instead of fetching from dev server -- @astrojs/sitemap generates XML only at build time, so dev server returns 404 for sitemap URLs

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Sitemap test adjusted for dev server limitation**
- **Found during:** Task 2 (Playwright test creation)
- **Issue:** Dev server does not serve build-time sitemap XML files (404 response)
- **Fix:** Changed sitemap tests to verify build output in dist/ directory using Node.js fs instead of HTTP requests to dev server
- **Files modified:** tests/sitemap.spec.ts
- **Verification:** All 3 sitemap tests pass
- **Committed in:** 0bf592f (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor test strategy adjustment. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All SEO infrastructure complete -- every page has unique meta, OG tags, and social images
- JSON-LD structured data live on home page with pricing tier information
- Full test coverage for phase 4 requirements (LEGL-01, LEGL-02, PERF-04, PERF-05, PERF-06, PERF-07)
- Plan 03 (documentation) can proceed -- no SEO dependencies remaining

## Self-Check: PASSED

All 13 files verified present. Both task commits (d5b3973, 0bf592f) verified in git log.

---
*Phase: 04-legal-seo-and-documentation*
*Completed: 2026-03-10*
