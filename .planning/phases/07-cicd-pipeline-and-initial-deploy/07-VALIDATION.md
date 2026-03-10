---
phase: 7
slug: cicd-pipeline-and-initial-deploy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.58.2 |
| **Config file** | `playwright.config.ts` (exists, needs CI webServer update) |
| **Quick run command** | `npx playwright test --project=chromium` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Validate YAML syntax with visual inspection + `npm run build` check
- **After every plan wave:** Push to main and verify full pipeline execution in GitHub Actions
- **Before `/gsd:verify-work`:** Full suite must be green, workflow runs green, site loads at getfierro.com
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | CICD-01 | structural | Verify `.github/workflows/deploy.yml` exists with correct YAML | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | CICD-01 | structural | Verify workflow uses `cloudflare/wrangler-action@v3` + secrets | ❌ W0 | ⬜ pending |
| 07-01-03 | 01 | 1 | CICD-01 | config | Verify `playwright.config.ts` CI-aware webServer update | ✅ | ⬜ pending |
| 07-01-04 | 01 | 1 | CICD-01 | smoke | Push to main → workflow runs → `curl https://getfierro.com` returns 200 | ❌ W0 | ⬜ pending |
| 07-01-05 | 01 | 1 | CICD-01 | docs | Verify `docs/DEPLOYMENT.md` extended with CI/CD Setup, DNS, troubleshooting | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `.github/workflows/deploy.yml` — the primary deliverable, does not exist yet
- [ ] `playwright.config.ts` update — webServer command needs CI-aware conditional for `npm run preview`
- [ ] GitHub repository secrets — `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be configured manually in GitHub UI
- [ ] `docs/DEPLOYMENT.md` extension — CI/CD Setup, token creation, DNS verification, troubleshooting FAQ sections

*Note: GitHub secrets configuration is a manual step outside of code — documented in DEPLOYMENT.md but not automatable.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Push triggers workflow | CICD-01 | Requires actual git push to main | 1. Push a commit to main 2. Check GitHub Actions tab 3. Verify workflow starts |
| Workflow deploys to Cloudflare | CICD-01 | Requires live secrets and Cloudflare account | 1. Watch workflow deploy step 2. Verify wrangler output shows success |
| getfierro.com loads | CICD-01 | Requires live URL after deploy | 1. After workflow completes 2. `curl https://getfierro.com` 3. Verify HTTP 200 |
| GitHub secrets configured | CICD-01 | Requires manual GitHub UI steps | 1. Go to repo Settings > Secrets 2. Verify CLOUDFLARE_API_TOKEN exists 3. Verify CLOUDFLARE_ACCOUNT_ID exists |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
