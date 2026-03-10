---
phase: 3
slug: pricing-and-why-fierro
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright ^1.58.2 (chromium-only project) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npx playwright test --project=chromium --grep "PRIC\|WHY"` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/pricing-*.spec.ts tests/why-fierro.spec.ts -x`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | PRIC-01 | e2e | `npx playwright test tests/pricing-tiers.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | PRIC-02 | e2e | `npx playwright test tests/pricing-tiers.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | PRIC-03 | e2e | `npx playwright test tests/pricing-toggle.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | PRIC-04 | e2e | `npx playwright test tests/pricing-comparison.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-05 | 01 | 1 | PRIC-05 | e2e | `npx playwright test tests/pricing-faq.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-06 | 01 | 1 | PRIC-06 | e2e | `npx playwright test tests/pricing-tiers.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-01-07 | 01 | 1 | PRIC-07 | e2e | `npx playwright test tests/pricing-toggle.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | WHY-01 | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | WHY-02 | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 1 | WHY-03 | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | ❌ W0 | ⬜ pending |
| 03-02-04 | 02 | 1 | WHY-04 | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/pricing-tiers.spec.ts` — stubs for PRIC-01, PRIC-02, PRIC-06
- [ ] `tests/pricing-toggle.spec.ts` — stubs for PRIC-03, PRIC-07
- [ ] `tests/pricing-comparison.spec.ts` — stubs for PRIC-04
- [ ] `tests/pricing-faq.spec.ts` — stubs for PRIC-05
- [ ] `tests/why-fierro.spec.ts` — stubs for WHY-01, WHY-02, WHY-03, WHY-04

*Existing infrastructure covers framework install (Playwright already configured).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Builder voice tone | WHY-02 | Subjective writing quality | Read narrative sections; verify direct, confident construction vocabulary |
| ROI claims defensibility | WHY-03 | Subjective claim evaluation | Review claims are directional ("days earlier") not fabricated numbers |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
