# Phase 7: CI/CD Pipeline and Initial Deploy - Research

**Researched:** 2026-03-10
**Domain:** GitHub Actions CI/CD, Cloudflare Workers deployment, Playwright in CI
**Confidence:** HIGH

## Summary

Phase 7 creates a single GitHub Actions workflow that builds, tests, and deploys the Astro static site to Cloudflare Workers on every push to main. The project already has all the building blocks: `wrangler.jsonc` with custom domain routing, `package.json` scripts for build/test/deploy, Playwright tests across 20 spec files, and a recommended workflow template in `docs/DEPLOYMENT.md`. The work is primarily wiring these together into `.github/workflows/deploy.yml` and extending the deployment docs.

The key technical decisions are straightforward: `cloudflare/wrangler-action@v3` handles the deploy step, `actions/setup-node@v4` with `cache: npm` handles dependency caching, and Playwright installs chromium-only with `--with-deps` for CI. The one configuration change needed is the Playwright `webServer` command -- it currently uses `npm run dev` but CI should use `npm run preview` against the built `dist/` folder for production-fidelity testing.

**Primary recommendation:** Build the workflow as a single job with sequential steps: checkout, setup-node, npm ci, build, install Playwright browsers, run tests (against preview server), deploy via wrangler-action, and post-deploy curl smoke check.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Pipeline: `npm ci` -> `npm run build` -> Playwright tests (against Astro preview server) -> `wrangler deploy`
- Tests gate deployment -- deploy only runs if build + tests pass
- Playwright runs against `localhost` preview of built `dist/` folder, not the live URL
- Lighthouse CI deferred -- add later when pipeline is stable (avoids Chrome install complexity in CI)
- Post-deploy smoke check: `curl` getfierro.com and verify HTTP 200 response
- Single workflow file: `.github/workflows/deploy.yml`
- Triggers on push to main only (no PR trigger needed -- solo developer, no branch protection)
- No Cloudflare preview deploys for branches
- No branch protection rules -- direct push to main is the workflow
- Extend existing `docs/DEPLOYMENT.md` with new CI/CD Setup section (keep all deploy info in one place)
- Step-by-step walkthrough for creating Cloudflare API token: dashboard navigation, exact permissions, where to copy token
- Instructions for adding token as GitHub repository secret (`CLOUDFLARE_API_TOKEN`)
- DNS verification steps for custom domain routing and SSL
- Short troubleshooting FAQ for common CI/CD issues
- GitHub default email notifications on workflow failure (no extra config)
- No auto-retry logic -- manually re-run from GitHub Actions UI for transient failures
- Post-deploy curl smoke check catches silent deploy failures

### Claude's Discretion
- Exact GitHub Actions step names and ordering
- Playwright test configuration for CI (headless Chrome, preview server start/stop)
- Node version pinning strategy (22 LTS)
- Curl smoke check implementation details (retry count, timeout, expected response)
- Troubleshooting FAQ content and organization
- Whether to cache npm dependencies in CI for faster builds

### Deferred Ideas (OUT OF SCOPE)
- Lighthouse CI in GitHub Actions -- add when pipeline is stable and Chrome install is worth the complexity
- PR preview deploys to temporary Cloudflare URLs -- add if team grows beyond solo dev
- Branch protection rules -- add if collaboration workflow changes
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CICD-01 | GitHub Actions workflow that builds and deploys to Cloudflare Workers on push to main, using `cloudflare/wrangler-action@v3` with `CLOUDFLARE_API_TOKEN` secret | Full workflow pattern documented: wrangler-action v3 inputs verified, Playwright CI config researched, post-deploy smoke check pattern identified, existing project assets (wrangler.jsonc, package.json scripts, DEPLOYMENT.md template) ready for integration |
</phase_requirements>

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `cloudflare/wrangler-action` | `@v3` (latest: 3.14.1) | Deploy to Cloudflare Workers from GitHub Actions | Official Cloudflare action, handles wrangler install + auth |
| `actions/checkout` | `@v4` | Clone repository in workflow | Standard GitHub action |
| `actions/setup-node` | `@v4` | Install Node.js with npm cache | Built-in npm caching support via `cache: npm` |
| `actions/upload-artifact` | `@v4` | Upload Playwright report on failure | Standard for CI artifacts |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Playwright | `^1.58.2` (already installed) | E2E tests gating deployment | Every CI run, chromium-only |
| `npx playwright install chromium --with-deps` | N/A | Install browser + OS deps in CI | CI-only, not cached (Playwright docs recommend fresh install) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `wrangler-action@v3` | Raw `npx wrangler deploy` | Action handles wrangler install, auth, and version management automatically |
| `actions/setup-node` npm cache | Manual `actions/cache` for `node_modules` | Built-in cache is simpler; manual cache is faster on hit but more config |
| Playwright browser caching | Fresh install each run | Playwright docs explicitly discourage caching -- restore time ~= download time, and OS deps cannot be cached on Linux |

## Architecture Patterns

### Workflow File Structure
```
.github/
  workflows/
    deploy.yml          # Single workflow: build -> test -> deploy -> smoke check
```

### Pattern 1: Single-Job Sequential Pipeline
**What:** All steps in one job -- build, test, deploy, verify -- running sequentially.
**When to use:** Solo developer, simple pipeline, no need for parallel jobs or matrix builds.
**Why:** Avoids artifact passing between jobs, simpler to debug, faster for a small static site.

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run tests
        run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy

      - name: Smoke check
        run: |
          for i in 1 2 3 4 5; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://getfierro.com)
            if [ "$STATUS" = "200" ]; then
              echo "Smoke check passed (HTTP $STATUS)"
              exit 0
            fi
            echo "Attempt $i: HTTP $STATUS, retrying in 10s..."
            sleep 10
          done
          echo "Smoke check failed after 5 attempts"
          exit 1
```

### Pattern 2: Playwright webServer Config for CI (Preview Mode)
**What:** Configure Playwright to use `npm run preview` instead of `npm run dev` in CI, so tests run against the built `dist/` folder.
**When to use:** CI pipeline where build step runs before tests.
**Critical insight:** The current `playwright.config.ts` uses `npm run dev` as the webServer command. For CI, this should be `npm run preview` to test the production build. The `astro preview` command serves the pre-built `dist/` directory -- it requires `npm run build` to have run first.

```typescript
// playwright.config.ts - updated webServer section
webServer: {
  command: process.env.CI ? 'npm run preview' : 'npm run dev',
  url: 'http://localhost:4321',
  reuseExistingServer: !process.env.CI,
  timeout: 30000,
},
```

**Note:** `astro preview` serves on port 4321 by default, same as `astro dev`, so `baseURL` does not change.

### Pattern 3: Two GitHub Secrets
**What:** Both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` stored as repository secrets.
**Why:** The existing `wrangler.jsonc` does NOT contain `account_id`. The wrangler-action's `accountId` input sets the `CLOUDFLARE_ACCOUNT_ID` environment variable, which wrangler reads at deploy time. Account ID is not sensitive (it's in every Cloudflare dashboard URL), but using a secret keeps the workflow file generic.

### Anti-Patterns to Avoid
- **Hardcoding account ID in wrangler.jsonc:** Unnecessarily couples the config to one account; better as env var for CI flexibility.
- **Using `npm run dev` for CI tests:** Dev server is slower to start, does not reflect production build, and may mask build-time errors.
- **Caching Playwright browsers:** Official docs say cache restore time equals download time; OS deps cannot be cached on Linux. Fresh install is the recommended approach.
- **Splitting into multiple jobs:** For a static site with a single deploy target, multiple jobs add artifact-passing complexity with no benefit.
- **Using `--with-deps` without specifying browser:** `npx playwright install --with-deps` installs ALL browsers (chromium, firefox, webkit). Use `npx playwright install chromium --with-deps` to install only what the project needs.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Wrangler install + auth in CI | Shell script to install and configure wrangler | `cloudflare/wrangler-action@v3` | Handles version management, auth, error reporting |
| npm dependency caching | Manual `actions/cache` with hash keys | `actions/setup-node@v4` with `cache: npm` | Built-in, zero config, handles cache key generation |
| Post-deploy health check with retries | Custom Node.js script | Shell `curl` with retry loop | Simple, no dependencies, sufficient for HTTP 200 check |
| Playwright test report upload | Custom artifact handling | `actions/upload-artifact@v4` | Standard, handles compression and retention |

**Key insight:** Every building block for this pipeline already exists as a well-maintained GitHub Action or project script. The work is assembly, not invention.

## Common Pitfalls

### Pitfall 1: Missing CLOUDFLARE_ACCOUNT_ID Secret
**What goes wrong:** Deploy step fails with "Could not route to /client/v4/accounts//workers/..." or similar account resolution error.
**Why it happens:** `wrangler.jsonc` does not contain `account_id`, and the action's `accountId` input was not provided.
**How to avoid:** Include `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}` in the wrangler-action step. Document both required secrets in DEPLOYMENT.md.
**Warning signs:** 401 or 404 errors from Cloudflare API in the deploy step logs.

### Pitfall 2: Playwright Tests Running Against Dev Server in CI
**What goes wrong:** Tests pass in CI but miss production build issues (missing files, broken asset paths, etc.).
**Why it happens:** `webServer.command` is `npm run dev` instead of `npm run preview`.
**How to avoid:** Update `playwright.config.ts` to use `npm run preview` when `process.env.CI` is true.
**Warning signs:** Tests pass but deployed site has broken pages/assets.

### Pitfall 3: Playwright Browser Install Timeout
**What goes wrong:** `npx playwright install chromium --with-deps` fails or times out.
**Why it happens:** Network issues, apt-get lock contention, or missing sudo permissions.
**How to avoid:** The `--with-deps` flag handles sudo internally on GitHub-hosted runners. Set adequate `timeout-minutes` on the job (15 minutes is generous for this pipeline).
**Warning signs:** Job killed at timeout with no clear error.

### Pitfall 4: Post-Deploy Smoke Check Fails Due to Propagation Delay
**What goes wrong:** `curl https://getfierro.com` returns 5xx or old content immediately after deploy.
**Why it happens:** Cloudflare edge propagation takes a few seconds after `wrangler deploy` completes.
**How to avoid:** Retry loop with 10-second delays (5 attempts = 50 seconds max wait). This is more than sufficient for Cloudflare Workers which typically propagate in under 30 seconds.
**Warning signs:** First attempt fails, later attempts succeed.

### Pitfall 5: API Token With Wrong Permissions
**What goes wrong:** Deploy fails with 403 Forbidden or permission denied errors.
**Why it happens:** Token was created without the "Edit Cloudflare Workers" template, or was scoped to wrong account/zone.
**How to avoid:** Document exact token creation steps: Dashboard > My Profile > API Tokens > Create Token > Use "Edit Cloudflare Workers" template > Scope to correct account.
**Warning signs:** 403 errors in wrangler deploy output.

### Pitfall 6: `npm run preview` Fails Because Build Step Was Skipped
**What goes wrong:** Playwright test step fails because `astro preview` has no `dist/` to serve.
**Why it happens:** Build step failed silently or was not ordered before tests.
**How to avoid:** Ensure `npm run build` step comes before the Playwright test step. If build fails, the workflow stops (sequential steps fail-fast by default).
**Warning signs:** "Cannot find dist directory" or "ENOENT" errors from astro preview.

## Code Examples

### Verified: Cloudflare Wrangler Action Usage
```yaml
# Source: https://github.com/cloudflare/wrangler-action README + Cloudflare Workers docs
- name: Deploy to Cloudflare Workers
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy
```

The `command: deploy` tells wrangler-action to run `wrangler deploy`, which reads `wrangler.jsonc` for worker name, asset directory (`./dist`), custom domain route (`getfierro.com`), and 404 handling.

### Verified: Playwright CI Configuration Update
```typescript
// Source: https://playwright.dev/docs/ci + Astro docs
// playwright.config.ts - CI-aware webServer
webServer: {
  command: process.env.CI ? 'npm run preview' : 'npm run dev',
  url: 'http://localhost:4321',
  reuseExistingServer: !process.env.CI,
  timeout: 30000,
},
```

### Verified: Chromium-Only Browser Install
```yaml
# Source: https://playwright.dev/docs/ci + https://playwright.dev/docs/browsers
- name: Install Playwright browsers
  run: npx playwright install chromium --with-deps
```

Installs only chromium browser binary + required OS dependencies (libnss3, libatk, etc.). Significantly faster than `npx playwright install --with-deps` which installs all three browsers.

### Post-Deploy Smoke Check with Retry
```yaml
# Pattern: curl retry loop for edge propagation delay
- name: Smoke check
  run: |
    for i in 1 2 3 4 5; do
      STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://getfierro.com)
      if [ "$STATUS" = "200" ]; then
        echo "Smoke check passed (HTTP $STATUS)"
        exit 0
      fi
      echo "Attempt $i: HTTP $STATUS, retrying in 10s..."
      sleep 10
    done
    echo "Smoke check failed after 5 attempts"
    exit 1
```

### Cloudflare API Token Creation Steps (for DEPLOYMENT.md)
```
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Find "Edit Cloudflare Workers" template, click "Use template"
4. Under Account Resources: select "Include" > your account name
5. Under Zone Resources: select "Include" > "All Zones" (or specific zone)
6. Click "Continue to summary" > "Create Token"
7. Copy the token immediately (it won't be shown again)
```

Token grants: Workers Routes Write, Workers Scripts Write, Workers KV Storage Write, Workers Tail Read, Workers R2 Storage Write, Account Settings Read, User Details Read, User Memberships Read.

### Adding GitHub Repository Secrets (for DEPLOYMENT.md)
```
1. Go to GitHub repo > Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: CLOUDFLARE_API_TOKEN, Value: (paste token from step above)
4. Click "Add secret"
5. Repeat for CLOUDFLARE_ACCOUNT_ID (found in Cloudflare dashboard URL or sidebar)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `wrangler-action@v2` | `wrangler-action@v3` (latest 3.14.1) | 2023 | TypeScript rewrite, bulk secrets, better error handling |
| `actions/setup-node@v3` | `actions/setup-node@v4` | 2023 | Built-in `cache: npm` option, simpler config |
| `wrangler.toml` | `wrangler.jsonc` (recommended) | Wrangler v3.91+ | JSON/JSONC support added, Cloudflare recommends for new projects |
| `actions/checkout@v3` | `actions/checkout@v4` | 2023 | Node 20 runtime |
| Playwright `--with-deps` (all browsers) | `install chromium --with-deps` | Always available | Significantly faster install in CI |

**Deprecated/outdated:**
- `wrangler-action` without `v` prefix (e.g., `@3.0.0`) -- v prefix now required
- `always-auth` input in `setup-node` -- removed, deprecated by npm

## Open Questions

1. **CLOUDFLARE_ACCOUNT_ID as separate secret vs hardcoded**
   - What we know: Account ID is not sensitive (visible in dashboard URLs), but using a secret keeps the workflow generic
   - Recommendation: Store as GitHub secret alongside API token for consistency and to avoid committing account-specific values

2. **Playwright report retention**
   - What we know: `actions/upload-artifact@v4` supports `retention-days`
   - Recommendation: 7 days is sufficient for a solo developer -- reduces storage usage while keeping recent runs accessible

3. **Workflow timeout**
   - What we know: Build takes ~10s locally, Playwright takes ~30s, deploy takes ~15s
   - Recommendation: `timeout-minutes: 15` gives generous headroom without risking runaway jobs

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.2 |
| Config file | `playwright.config.ts` (exists, needs CI webServer update) |
| Quick run command | `npx playwright test --project=chromium` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CICD-01 | Workflow file exists with correct structure | manual + smoke | Verify `.github/workflows/deploy.yml` structure manually; post-push: check GitHub Actions UI | N/A -- workflow file validation is structural |
| CICD-01 | Workflow uses wrangler-action@v3 with CLOUDFLARE_API_TOKEN | manual | Inspect workflow YAML for correct action reference and secret usage | N/A -- YAML inspection |
| CICD-01 | Push to main triggers workflow and deploys | smoke | Push to main, verify workflow runs in GitHub Actions UI | N/A -- requires actual push |
| CICD-01 | getfierro.com loads successfully | smoke | `curl -s -o /dev/null -w "%{http_code}" https://getfierro.com` returns 200 | N/A -- live URL check |

### Sampling Rate
- **Per task commit:** Validate YAML syntax with `npx yaml-lint` or visual inspection
- **Per wave merge:** Push to main and verify full pipeline execution in GitHub Actions
- **Phase gate:** Workflow runs green, site loads at getfierro.com

### Wave 0 Gaps
- [ ] `.github/workflows/deploy.yml` -- the primary deliverable, does not exist yet
- [ ] `playwright.config.ts` update -- webServer command needs CI-aware conditional for `npm run preview`
- [ ] GitHub repository secrets -- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be configured manually in GitHub UI
- [ ] `docs/DEPLOYMENT.md` extension -- CI/CD Setup, token creation, DNS verification, troubleshooting FAQ sections

## Sources

### Primary (HIGH confidence)
- [Cloudflare Workers GitHub Actions docs](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) -- workflow structure, required secrets
- [cloudflare/wrangler-action GitHub](https://github.com/cloudflare/wrangler-action) -- v3 inputs (apiToken, accountId, command), latest version 3.14.1
- [Playwright CI docs](https://playwright.dev/docs/ci) -- GitHub Actions workflow, browser install, caching guidance (don't cache)
- [Cloudflare API token templates](https://developers.cloudflare.com/fundamentals/api/reference/template/) -- "Edit Cloudflare Workers" template permissions
- [actions/setup-node](https://github.com/actions/setup-node) -- built-in npm cache, v4 usage

### Secondary (MEDIUM confidence)
- [Cloudflare wrangler system environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/) -- CLOUDFLARE_ACCOUNT_ID env var behavior
- [Astro CLI docs](https://docs.astro.build/en/reference/cli-reference/) -- `astro preview` serves built `dist/` on port 4321

### Tertiary (LOW confidence)
- None -- all critical findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools are official, well-documented GitHub Actions and Cloudflare tools
- Architecture: HIGH -- single-job pipeline is well-established pattern for simple deploys; project already has all building blocks
- Pitfalls: HIGH -- each pitfall is derived from documented behaviors (missing account_id, dev vs preview server, propagation delay)

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (stable tooling, unlikely to change significantly)
