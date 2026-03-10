---
phase: 5
slug: performance-audit-and-launch-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.58.x + @lhci/cli 0.15.x |
| **Config file** | `playwright.config.ts` (exists) + `lighthouserc.js` (Wave 0) |
| **Quick run command** | `npx playwright test tests/accessibility.spec.ts tests/responsive.spec.ts --project=chromium` |
| **Full suite command** | `npm run build && npx lhci autorun && npx playwright test --project=chromium` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/accessibility.spec.ts tests/responsive.spec.ts --project=chromium`
- **After every plan wave:** Run `npm run build && npx lhci autorun && npx playwright test --project=chromium`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 0 | PERF-01 | lighthouse-ci | `npm run build && npx lhci autorun` | No -- Wave 0 | ⬜ pending |
| 05-01-02 | 01 | 0 | PERF-02 | lighthouse-ci | `npm run build && npx lhci autorun` | No -- Wave 0 | ⬜ pending |
| 05-01-03 | 01 | 0 | PERF-03 | lighthouse-ci | `npm run build && npx lhci autorun` | No -- Wave 0 | ⬜ pending |
| 05-01-04 | 01 | 0 | PERF-08 | playwright | `npx playwright test tests/responsive.spec.ts --project=chromium -x` | No -- Wave 0 | ⬜ pending |
| 05-01-05 | 01 | 0 | PERF-08 | playwright | `npx playwright test tests/accessibility.spec.ts --project=chromium -x` | No -- Wave 0 | ⬜ pending |
| 05-01-06 | 01 | 0 | PERF-08 | lighthouse-ci | Covered by `categories:accessibility` assertion in lighthouserc.js | No -- Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lighthouserc.js` — Lighthouse CI configuration file (collect URLs, assert scores)
- [ ] `tests/accessibility.spec.ts` — skip link, focus trap, landmarks, decorative SVGs
- [ ] `tests/responsive.spec.ts` — viewport tests at 375/768/1280px
- [ ] Install `@lhci/cli` as devDependency
- [ ] Add `test:lighthouse` and `test:all` npm scripts
- [ ] Add `.lighthouseci/` to `.gitignore`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| *None* | — | — | All phase behaviors have automated verification. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
