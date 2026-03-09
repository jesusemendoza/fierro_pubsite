---
phase: 1
slug: foundation-and-site-chrome
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (latest) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx playwright test --project=chromium` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FNDN-01 | smoke | `npm run build` | N/A (build script) | ⬜ pending |
| 01-01-02 | 01 | 1 | FNDN-02 | e2e | `npx playwright test tests/brand.spec.ts -x` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | FNDN-03 | e2e | `npx playwright test tests/layout.spec.ts -x` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | NAV-01 | e2e | `npx playwright test tests/nav.spec.ts -x` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | NAV-02 | e2e | `npx playwright test tests/nav-mobile.spec.ts -x` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | NAV-03 | e2e | `npx playwright test tests/footer.spec.ts -x` | ❌ W0 | ⬜ pending |
| 01-02-04 | 02 | 1 | NAV-04 | e2e | `npx playwright test tests/nav.spec.ts -x` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | FNDN-04 | manual-only | Manual DNS/deployment verification | N/A | ⬜ pending |
| 01-03-02 | 03 | 2 | FNDN-05 | manual-only | No images in Phase 1 stubs | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `playwright.config.ts` — Playwright config with webServer pointing to Astro dev/preview
- [ ] `tests/nav.spec.ts` — covers NAV-01, NAV-04
- [ ] `tests/nav-mobile.spec.ts` — covers NAV-02
- [ ] `tests/footer.spec.ts` — covers NAV-03
- [ ] `tests/layout.spec.ts` — covers FNDN-03
- [ ] `tests/brand.spec.ts` — covers FNDN-02
- [ ] Framework install: `npm install -D @playwright/test && npx playwright install chromium`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Site deploys and serves from getfierro.com | FNDN-04 | Requires live DNS and Cloudflare account access | 1. Run `wrangler deploy` 2. Visit getfierro.com 3. Verify page loads with brand styling |
| Images served from src/assets via Astro optimization | FNDN-05 | No images in Phase 1 stub pages | Verify `src/assets/` directory exists and logo.svg is importable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

---

*Phase: 01-foundation-and-site-chrome*
*Validation strategy created: 2026-03-09*
