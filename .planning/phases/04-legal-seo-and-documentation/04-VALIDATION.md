---
phase: 4
slug: legal-seo-and-documentation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright ^1.58.2 |
| **Config file** | playwright.config.ts |
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
| 04-01-01 | 01 | 1 | LEGL-01 | e2e | `npx playwright test tests/legal.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | LEGL-02 | e2e | `npx playwright test tests/legal.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | PERF-04 | e2e | `npx playwright test tests/seo-meta.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 04-01-04 | 01 | 1 | PERF-05 | e2e | `npx playwright test tests/seo-meta.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 04-01-05 | 01 | 1 | PERF-06 | e2e | `npx playwright test tests/structured-data.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 04-01-06 | 01 | 1 | PERF-07 | e2e | `npx playwright test tests/sitemap.spec.ts --project=chromium -x` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | DOCS-01 | manual | manual check -- file existence and content review | N/A | ⬜ pending |
| 04-02-02 | 02 | 2 | DOCS-02 | manual | manual check -- file existence and content review | N/A | ⬜ pending |
| 04-02-03 | 02 | 2 | DOCS-03 | manual | manual check -- file existence and content review | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/legal.spec.ts` -- stubs for LEGL-01, LEGL-02 (page rendering, content presence, header band, prose styling)
- [ ] `tests/seo-meta.spec.ts` -- stubs for PERF-04, PERF-05 (unique titles, descriptions, OG tags per page)
- [ ] `tests/structured-data.spec.ts` -- stubs for PERF-06 (JSON-LD presence and basic structure validation)
- [ ] `tests/sitemap.spec.ts` -- stubs for PERF-07 (sitemap-index.xml accessible, contains expected URLs)

*DOCS-01, DOCS-02, DOCS-03 are manual verification (file existence) -- no automated test needed for markdown docs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| DEPLOYMENT.md content completeness | DOCS-01 | Prose content -- no programmatic assertion | Review file exists at docs/DEPLOYMENT.md, verify it covers Cloudflare Workers setup, build commands, CI/CD |
| MIGRATION.md content completeness | DOCS-02 | Prose content -- no programmatic assertion | Review file exists at docs/MIGRATION.md, verify it covers DNS, auth redirects, OAuth, Stripe, env vars |
| deep-link-signup-flow.md in sibling repo | DOCS-03 | Cross-repo file -- outside test scope | Verify file exists at ../fierro_web/docs/plans/deep-link-signup-flow.md |
| OG images render correctly on social platforms | PERF-05 | Social crawlers can't be simulated locally | Use social sharing debugger tools (Facebook, Twitter) after deploy |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
