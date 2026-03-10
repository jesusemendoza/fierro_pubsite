---
phase: 03-pricing-and-why-fierro
plan: 01
subsystem: ui
tags: [astro, tailwind, custom-elements, pricing, faq, toggle, playwright]

# Dependency graph
requires:
  - phase: 02-landing-page
    provides: BaseLayout, ClosingCta component, data-animate scroll system, brand tokens
provides:
  - Complete /pricing page with three-tier card layout
  - PricingToggle vanilla JS custom element (monthly/annual billing toggle)
  - TierCard reusable component with deep-linked CTAs
  - ComparisonTable with 10-row feature comparison
  - PricingFaq with 5 value-objection accordion items
  - 26 Playwright tests across 4 files covering PRIC-01 through PRIC-07
affects: [03-02-why-fierro, 04-legal-seo-docs]

# Tech tracking
tech-stack:
  added: []
  patterns: [vanilla JS custom element for client-side interactivity, native details/summary accordion]

key-files:
  created:
    - src/components/pricing/TierCard.astro
    - src/components/pricing/PricingToggle.astro
    - src/components/pricing/ComparisonTable.astro
    - src/components/pricing/PricingFaq.astro
    - tests/pricing-tiers.spec.ts
    - tests/pricing-toggle.spec.ts
    - tests/pricing-comparison.spec.ts
    - tests/pricing-faq.spec.ts
  modified:
    - src/pages/pricing.astro

key-decisions:
  - "Vanilla JS custom element for pricing toggle -- zero framework overhead, connectedCallback() handles view transitions natively"
  - "Native details/summary for FAQ accordion -- zero JS, built-in accessibility"
  - "Dark gunmetal hero section on pricing page for Nav transparency compatibility"
  - "data-billing-link attribute on tier CTAs for scoped test selectors"

patterns-established:
  - "Custom element pattern: class extends HTMLElement with connectedCallback, registered via customElements.define"
  - "Price data attributes: data-price-monthly/data-price-annual for JS toggle integration"
  - "data-billing-link attribute on CTA anchors for dynamic billing param updates"

requirements-completed: [PRIC-01, PRIC-02, PRIC-03, PRIC-04, PRIC-05, PRIC-06, PRIC-07]

# Metrics
duration: 5min
completed: 2026-03-09
---

# Phase 3 Plan 1: Pricing Page Summary

**Three-tier pricing page with vanilla JS monthly/annual toggle, feature comparison table, FAQ accordion, and 26 Playwright tests covering all 7 PRIC requirements**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-10T02:31:53Z
- **Completed:** 2026-03-10T02:37:13Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Complete /pricing page replacing stub with dark hero, three tier cards (Free $0, Plus $49, Builder Custom), comparison table, FAQ, and ClosingCta
- PricingToggle custom element switches prices between monthly/annual, shows "$118/year" savings callout, updates CTA billing query params dynamically
- Plus tier highlighted with "Most Popular" badge and ring accent; Builder tier with subtle visual distinction
- 26 Playwright tests across 4 files -- all pass, covering PRIC-01 through PRIC-07

## Task Commits

Each task was committed atomically:

1. **Task 1: Build pricing components** - `ed07507` (feat)
2. **Task 2: Assemble pricing page and write Playwright tests** - `cdf4a5a` (feat)

## Files Created/Modified
- `src/components/pricing/TierCard.astro` - Reusable tier card with price data attributes, features list, CTA deep-links
- `src/components/pricing/PricingToggle.astro` - Vanilla JS custom element toggling monthly/annual prices and billing params
- `src/components/pricing/ComparisonTable.astro` - 10-row feature comparison table with actual limits per tier
- `src/components/pricing/PricingFaq.astro` - 5-item FAQ accordion using native details/summary elements
- `src/pages/pricing.astro` - Full pricing page replacing stub (dark hero, cards, comparison, FAQ, ClosingCta)
- `tests/pricing-tiers.spec.ts` - 8 tests covering PRIC-01, PRIC-02, PRIC-06
- `tests/pricing-toggle.spec.ts` - 8 tests covering PRIC-03, PRIC-07
- `tests/pricing-comparison.spec.ts` - 5 tests covering PRIC-04
- `tests/pricing-faq.spec.ts` - 5 tests covering PRIC-05

## Decisions Made
- Vanilla JS custom element for pricing toggle (zero framework deps, connectedCallback handles view transitions)
- Native details/summary for FAQ accordion (zero JS, built-in accessibility and keyboard nav)
- Dark gunmetal hero/header section at top of pricing page ensures Nav white text is visible before scroll
- Used data-billing-link attribute on CTA anchors to scope test selectors and enable JS toggle integration

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed "Start Free" CTA test selector ambiguity**
- **Found during:** Task 2 (Playwright test execution)
- **Issue:** `page.locator('a', { hasText: 'Start Free' })` matched 5 elements (nav, mobile menu, tier card, closing CTA, footer)
- **Fix:** Scoped to `page.locator('a[data-billing-link]', { hasText: 'Start Free' })` to target tier card CTA only
- **Files modified:** tests/pricing-toggle.spec.ts
- **Verification:** Test passes in isolation and in full suite
- **Committed in:** cdf4a5a (Task 2 commit)

**2. [Rule 1 - Bug] Fixed comparison table Projects row locator**
- **Found during:** Task 2 (Playwright test execution)
- **Issue:** `hasText: /^Projects/` regex failed to match row element whose inner text spans multiple cells
- **Fix:** Used `tbody tr` filtered by `td:first-child` containing "Projects" with `.first()` for uniqueness
- **Files modified:** tests/pricing-comparison.spec.ts
- **Verification:** Test passes, correctly validates 1/5/Unlimited limits
- **Committed in:** cdf4a5a (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs in test locators)
**Impact on plan:** Both auto-fixes were test selector corrections. No scope creep. All planned functionality delivered.

## Issues Encountered
- 4 pre-existing test failures in nav.spec.ts (3) and landing-animations.spec.ts (1) -- unrelated to pricing changes, not in scope

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Pricing page complete with all interactive features and deep-linked CTAs
- PricingToggle custom element pattern established for any future client-side interactivity
- Ready for 03-02 (Why Fierro page) which shares ClosingCta and data-animate patterns

## Self-Check: PASSED

All 9 files verified present. Both task commits (ed07507, cdf4a5a) verified in git log. 26 Playwright tests pass. Build completes without errors.

---
*Phase: 03-pricing-and-why-fierro*
*Plan: 01*
*Completed: 2026-03-09*
