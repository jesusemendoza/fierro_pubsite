---
phase: 2
slug: landing-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.58.2 |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npx playwright test --project=chromium -x` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test --project=chromium -x`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | LAND-01 | e2e | `npx playwright test tests/landing-hero.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | LAND-02 | e2e | `npx playwright test tests/landing-hero.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | LAND-04 | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | LAND-05 | e2e | `npx playwright test tests/landing-features.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 1 | LAND-06 | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-06 | 01 | 1 | LAND-08 | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-07 | 01 | 1 | LAND-09 | e2e | `npx playwright test tests/landing-animations.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-08 | 01 | 1 | LAND-03 | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 02-01-09 | 01 | 1 | LAND-07 | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/landing-hero.spec.ts` — stubs for LAND-01, LAND-02
- [ ] `tests/landing-sections.spec.ts` — stubs for LAND-03 (skipped), LAND-04, LAND-06, LAND-07 (skipped), LAND-08
- [ ] `tests/landing-features.spec.ts` — stubs for LAND-05
- [ ] `tests/landing-animations.spec.ts` — stubs for LAND-09

*All test files are new — Wave 0 must create them.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual dark premium aesthetic | LAND-01 | Subjective design quality | Verify hero has dark bg, premium feel, proper contrast |
| SVG illustration quality | LAND-01 | Subjective visual design | Verify dashboard mockup SVG looks professional |
| Animation smoothness | LAND-09 | Performance perception | Scroll page, verify 60fps feel with no jank |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
