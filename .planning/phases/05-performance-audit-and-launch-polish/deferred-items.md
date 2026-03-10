# Deferred Items - Phase 05

## Pre-existing Test Failures (Out of Scope)

These 6 Playwright test failures exist in the codebase prior to Plan 05-02 and are not caused by this plan's changes:

1. **nav.spec.ts:4** - "nav is visible with all expected links" -- strict mode violation, locator matches both Nav and MobileMenu nav elements
2. **nav.spec.ts:14** - "Login link points to app.getfierro.com/login" -- same strict mode issue with duplicate nav selectors
3. **nav.spec.ts:20** - "Start Free CTA points to app.getfierro.com/signup" -- same strict mode issue
4. **legal.spec.ts:36** - "contact email privacy@getfierro.com appears on page" -- email text mismatch
5. **pricing-tiers.spec.ts:36** - "Plus card has Most Popular badge visible" -- badge element removed from TierCard.astro
6. **why-fierro.spec.ts:42** - "AI integration section is visible with AI in heading text" -- heading locator mismatch

**Recommended fix:** Update these test locators to use more specific selectors (e.g., `#main-nav` scoping for nav tests).
