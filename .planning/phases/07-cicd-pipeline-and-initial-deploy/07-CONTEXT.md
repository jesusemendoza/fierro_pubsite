# Phase 7: CI/CD Pipeline and Initial Deploy - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

GitHub Actions workflow that automatically builds, tests, and deploys the Astro static site to Cloudflare Workers on push to main. Extends existing `docs/DEPLOYMENT.md` with step-by-step Cloudflare setup instructions, DNS verification, and troubleshooting. No new site features or pages.

</domain>

<decisions>
## Implementation Decisions

### Workflow steps
- Pipeline: `npm ci` -> `npm run build` -> Playwright tests (against Astro preview server) -> `wrangler deploy`
- Tests gate deployment — deploy only runs if build + tests pass
- Playwright runs against `localhost` preview of built `dist/` folder, not the live URL
- Lighthouse CI deferred — add later when pipeline is stable (avoids Chrome install complexity in CI)
- Post-deploy smoke check: `curl` getfierro.com and verify HTTP 200 response

### Branch strategy
- Single workflow file: `.github/workflows/deploy.yml`
- Triggers on push to main only (no PR trigger needed — solo developer, no branch protection)
- No Cloudflare preview deploys for branches
- No branch protection rules — direct push to main is the workflow

### Cloudflare setup documentation
- Extend existing `docs/DEPLOYMENT.md` with new CI/CD Setup section (keep all deploy info in one place)
- Step-by-step walkthrough for creating Cloudflare API token: dashboard navigation, exact permissions, where to copy token
- Instructions for adding token as GitHub repository secret (`CLOUDFLARE_API_TOKEN`)
- DNS verification steps for custom domain routing and SSL
- Short troubleshooting FAQ for common CI/CD issues (expired token, wrong permissions, build fails in CI but works locally, domain not routing)

### Failure handling
- GitHub default email notifications on workflow failure (no extra config)
- No auto-retry logic — manually re-run from GitHub Actions UI for transient failures
- Post-deploy curl smoke check catches silent deploy failures

### Claude's Discretion
- Exact GitHub Actions step names and ordering
- Playwright test configuration for CI (headless Chrome, preview server start/stop)
- Node version pinning strategy (22 LTS)
- Curl smoke check implementation details (retry count, timeout, expected response)
- Troubleshooting FAQ content and organization
- Whether to cache npm dependencies in CI for faster builds

</decisions>

<specifics>
## Specific Ideas

- `docs/DEPLOYMENT.md` already has a recommended workflow YAML template (Phase 4) — build on it, don't start from scratch
- The `wrangler.jsonc` is already configured with custom domain route (`getfierro.com`) and 404 handling
- `package.json` already has `deploy` script (`astro build && wrangler deploy`) and `wrangler` as devDependency
- Audience for docs: "future me" — clear commands, covers gotchas, no hand-holding on basics (from Phase 4 context)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `wrangler.jsonc` — Worker config with custom domain route, asset directory, 404 handling (ready to use)
- `docs/DEPLOYMENT.md` — Has manual deploy steps and recommended CI/CD YAML template to build upon
- `package.json` scripts: `build` (astro build), `deploy` (astro build && wrangler deploy), `test` (playwright test), `test:lighthouse` (lhci autorun)
- Playwright test suite — established across phases 1-5, ready to run in CI
- `@lhci/cli` installed as devDependency — available for future CI Lighthouse integration

### Established Patterns
- Pure static deployment: Astro builds to `dist/`, wrangler uploads to Workers Static Assets
- No SSR adapter — fully static output, simple build pipeline
- `public/_headers` for HTTP response headers (security + cache headers already configured)
- Inline scripts only (no framework runtime) — fast builds, small output

### Integration Points
- `.github/workflows/deploy.yml` — new file, GitHub Actions workflow
- `docs/DEPLOYMENT.md` — extend with CI/CD Setup, DNS verification, and troubleshooting sections
- GitHub repository secrets — `CLOUDFLARE_API_TOKEN`
- Cloudflare Dashboard — API token creation, DNS records, Workers dashboard

</code_context>

<deferred>
## Deferred Ideas

- Lighthouse CI in GitHub Actions — add when pipeline is stable and Chrome install is worth the complexity
- PR preview deploys to temporary Cloudflare URLs — add if team grows beyond solo dev
- Branch protection rules — add if collaboration workflow changes

</deferred>

---

*Phase: 07-cicd-pipeline-and-initial-deploy*
*Context gathered: 2026-03-10*
