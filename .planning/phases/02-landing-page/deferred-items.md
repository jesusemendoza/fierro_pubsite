# Deferred Items - Phase 02

## Pre-existing Test Failures

**nav.spec.ts strict mode violations** (discovered during 02-03 test run)
- `nav a[href="/pricing"]` selector resolves to 3 elements (Nav, MobileMenu, Footer)
- Same issue for `nav a[href="https://app.getfierro.com/login"]` and signup link
- Root cause: Playwright strict mode fails when multiple matching `<a>` elements exist across Nav, MobileMenu, and Footer semantic `<nav>` elements
- Fix: Scope nav test selectors to `#main-nav` (e.g., `page.locator('#main-nav a[href="/pricing"]')`)
- Not fixed: Pre-existing issue from Phase 01, not caused by Phase 02 changes
