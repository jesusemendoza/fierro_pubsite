---
phase: 01-foundation-and-site-chrome
plan: 02
subsystem: ui
tags: [nav, mobile-menu, footer, base-layout, stub-pages]

# Dependency graph
requires:
  - phase: 01-foundation-and-site-chrome
    plan: 01
    provides: "Astro scaffold, BaseLayout, brand tokens"
provides:
  - Nav with transparent-to-solid scroll transition
  - MobileMenu with 44px+ touch targets
  - Footer with Off-White background
  - 5 stub pages (/, /pricing, /why-fierro, /privacy, /terms)
affects: [02, 03, 04, 05]

# Tech tracking
tech-stack:
  added: []
  patterns: [fixed-nav-with-scroll-transition, mobile-menu-overlay-pattern, astro-page-load-event-listeners]

key-files:
  created:
    - src/components/Nav.astro
    - src/components/MobileMenu.astro
    - src/components/Footer.astro
    - src/pages/pricing.astro
    - src/pages/why-fierro.astro
    - src/pages/privacy.astro
    - src/pages/terms.astro
  modified:
    - src/layouts/BaseLayout.astro
    - src/pages/index.astro

key-decisions:
  - "MobileMenu z-index must be higher than Nav z-index (z-[60] > z-50) for close button clickability"
  - "astro:page-load event (not top-level script) for ClientRouter compatibility"
  - "No social links in footer per user decision"

patterns-established:
  - "Fixed nav with transparent-to-solid transition on scroll (50px threshold)"
  - "Full-screen mobile overlay pattern with overflow-hidden body lock"
  - "astro:page-load listeners for all interactive scripts (ClientRouter view transitions re-run)"

requirements-completed: [NAV-01, NAV-02, NAV-03, NAV-04]

# Metrics
duration: 3min
completed: 2026-03-09
---

# Phase 1 Plan 02: Nav, MobileMenu, Footer, and Stub Pages Summary

**Sticky navigation with transparent-to-solid scroll transition, full-screen mobile hamburger menu with 44px+ touch targets, Off-White footer, and 5 stub pages wired into BaseLayout**

## Performance

- **Duration:** ~3 min (retroactive -- original execution time not recorded)
- **Started:** 2026-03-09
- **Completed:** 2026-03-09
- **Tasks:** 2 auto + 1 checkpoint (visual verification)
- **Files modified:** 9 created + 2 modified = 11 total

## Accomplishments
- Nav component: sticky fixed positioning with transparent-to-solid Gunmetal scroll transition (50px threshold, 300ms ease), Fierro logo, desktop links (Features, Pricing, Why Fierro), Login external link, and ghost "Start Free" CTA button
- MobileMenu component: full-screen dark overlay with hamburger toggle, close button (X), vertically stacked nav links with 44px+ min-height touch targets, body scroll lock via overflow-hidden, z-[60] above Nav z-50
- Footer component: Off-White background with subtle top border, page links (Features, Pricing, Why Fierro, Privacy, Terms), copyright with dynamic year, and "Ready to take control?" signup CTA
- BaseLayout integration: Nav, MobileMenu, and Footer imported and rendered around the main slot on every page
- 5 stub pages created with working routes: / (home with branded tagline), /pricing, /why-fierro, /privacy, /terms -- all wrapped in BaseLayout with pt-20 clearance for fixed nav

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Nav, MobileMenu, and Footer components** - `87d27bf` (feat)
2. **Task 2: Create all 5 stub pages with BaseLayout and working nav links** - `6174a24` (feat)

**Post-UAT bugfix:** `d98f766` fix(01): mobile menu close button z-index above nav

## Files Created/Modified
- `src/components/Nav.astro` (114 lines) - Sticky nav with scroll-based background transition JS, logo, desktop links, ghost CTA, hamburger toggle button
- `src/components/MobileMenu.astro` (60 lines) - Full-screen overlay with close button, 44px+ touch target links, full-width "Start Free" button
- `src/components/Footer.astro` (64 lines) - Off-White background, subtle top border, page links, copyright with dynamic year, signup CTA
- `src/pages/pricing.astro` - Pricing stub page with BaseLayout
- `src/pages/why-fierro.astro` - Why Fierro stub page with BaseLayout
- `src/pages/privacy.astro` - Privacy Policy stub page with BaseLayout
- `src/pages/terms.astro` - Terms of Service stub page with BaseLayout
- `src/layouts/BaseLayout.astro` (modified) - Added Nav, MobileMenu, and Footer imports and rendering around slot
- `src/pages/index.astro` (modified) - Enhanced from minimal stub to branded placeholder with "Every dollar. Every pour. Accounted for." tagline

## Decisions Made
- MobileMenu z-[60] to render above Nav z-50 -- ensures close button (X) is clickable and not intercepted by the nav bar
- Used `astro:page-load` event instead of top-level script for scroll listeners and menu toggle -- required for ClientRouter view transition compatibility (scripts re-run on page navigation)
- No social links in footer per user decision -- keeps footer clean and avoids linking to non-existent social profiles

## Deviations from Plan
None for the two auto tasks. Post-UAT bugfix documented below in Issues Encountered.

## Issues Encountered

**MobileMenu z-index bug (fixed in d98f766):** UAT test 8 found that the close button (X) on MobileMenu was not clickable. Root cause: MobileMenu had z-40, lower than Nav's z-50, so the nav bar intercepted clicks on the close button area. Fix: changed MobileMenu to z-[60]. Commit: `d98f766` fix(01): mobile menu close button z-index above nav.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 pages routable with working nav links (no 404s)
- Nav and Footer render on every page via BaseLayout
- Ready for Phase 2 landing page content (index.astro will be replaced with full landing sections)
- Scroll transition testable once Phase 2 adds enough content to scroll

## Self-Check: PASSED

All 9 files verified present (7 created + 2 modified). Commits 87d27bf, 6174a24, d98f766 verified in git log. UAT passed 9/11 tests (1 fixed via d98f766, 1 skipped -- scroll transition deferred to Phase 2 due to insufficient stub page content height).

---
*Phase: 01-foundation-and-site-chrome*
*Completed: 2026-03-09*
