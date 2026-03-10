# Deployment Guide

Fierro marketing site -- Astro static site deployed to Cloudflare Workers Static Assets.

No SSR. Pure static. Astro builds to `dist/`, wrangler uploads it.

## Prerequisites

- Node.js (LTS)
- npm
- Cloudflare account with Workers plan
- `wrangler` installed as devDependency (already in package.json)

## Project Structure

Key config files:

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Site URL (`https://getfierro.com`), Tailwind vite plugin, sitemap integration |
| `wrangler.jsonc` | Worker name, asset directory, custom domain route, 404 handling |
| `package.json` | Scripts for dev/build/deploy/test |

## Local Development

```bash
# Dev server (hot reload) -- http://localhost:4321
npm run dev

# Production build -- outputs to dist/
npm run build

# Preview production build locally
npm run preview
```

## Deployment

```bash
# Build + deploy in one command
npm run deploy
```

This runs `astro build && wrangler deploy`:
1. Astro builds static HTML/CSS/JS to `dist/`
2. Wrangler uploads `dist/` contents to Cloudflare Workers Static Assets
3. Custom domain route (`getfierro.com`) serves the assets

First deploy requires `wrangler login` to authenticate with Cloudflare.

## Custom Domain

Configured in `wrangler.jsonc`:

```jsonc
{
  "routes": [
    {
      "pattern": "getfierro.com",
      "custom_domain": true
    }
  ]
}
```

Cloudflare DNS must have the domain proxied (orange cloud). The `custom_domain: true` flag tells Cloudflare to handle SSL and routing automatically after `wrangler deploy`.

## CI/CD Pipeline

Automated via GitHub Actions. Every push to `main` triggers:

1. `npm ci` -- install locked dependencies
2. `npm run build` -- Astro static build to `dist/`
3. `npx playwright test` -- Playwright tests against `npm run preview` (production build)
4. `wrangler deploy` -- upload `dist/` to Cloudflare Workers
5. Smoke check -- curl `https://getfierro.com` for HTTP 200

Source of truth: `.github/workflows/deploy.yml`

Deploy only proceeds if build and tests pass. Smoke check retries 5x with 10s intervals.

### CI/CD Setup

First-time setup for a fresh clone or new collaborator.

**1. Create Cloudflare API Token**

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Find "Edit Cloudflare Workers" template, click "Use template"
4. Account Resources: select "Include" > your account name
5. Zone Resources: select "Include" > "All Zones" (or specific zone for getfierro.com)
6. Click "Continue to summary" > "Create Token"
7. Copy the token immediately -- shown only once

**2. Find Cloudflare Account ID**

- Visible in the Cloudflare dashboard URL: `https://dash.cloudflare.com/<account-id>`
- Also shown in the right sidebar of the Workers & Pages overview

**3. Add GitHub Repository Secrets**

1. Go to GitHub repo > Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add `CLOUDFLARE_API_TOKEN` with the token value
4. Add `CLOUDFLARE_ACCOUNT_ID` with the account ID value

### DNS & Custom Domain

Cloudflare DNS must have `getfierro.com` proxied (orange cloud icon). The `wrangler.jsonc` route uses `custom_domain: true` -- Cloudflare handles SSL automatically after the first `wrangler deploy`.

Verify:

```bash
curl -I https://getfierro.com
# Should show cf-ray header and valid SSL
```

First deploy with a custom domain may take a few minutes for DNS propagation.

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Deploy fails with 403 | API token wrong permissions or expired | Recreate token using "Edit Cloudflare Workers" template |
| Deploy fails with account routing error | Missing `CLOUDFLARE_ACCOUNT_ID` secret | Add account ID as GitHub secret (Settings > Secrets) |
| Build fails in CI but works locally | Node version mismatch or missing dependency | Check `node-version: 22` in workflow; use `npm ci` not `npm install` |
| Tests fail in CI but pass locally | Dev vs preview server difference | CI uses `npm run preview` (production build); check test doesn't assume dev-only behavior |
| Smoke check fails after deploy | Edge propagation delay (normally < 30s) | Re-run workflow; if persistent, check Cloudflare Workers dashboard for errors |
| Domain not routing to site | DNS not proxied or custom domain not configured | Verify orange cloud in Cloudflare DNS; run `wrangler deploy` to register route |

## Gotchas

- **404 handling:** `wrangler.jsonc` sets `not_found_handling: "404-page"`. Astro generates `dist/404.html` from `src/pages/404.astro` (if it exists). Without it, Cloudflare returns a generic 404.
- **No SSR:** This is a fully static site. No `@astrojs/cloudflare` adapter. No server-side routes. If you need SSR, you'd need to add the adapter and change the output config.
- **Asset hashing:** Astro hashes CSS/JS filenames for cache busting (`/_astro/index.abc123.css`). Don't reference built asset paths directly -- they change every build.
- **Sitemap:** Generated at build time by `@astrojs/sitemap`. Output is `dist/sitemap-index.xml` and `dist/sitemap-0.xml`. Referenced in `robots.txt`.
- **OG images:** Stored in `public/og/` (not `src/assets/`). Files in `public/` are copied as-is to `dist/` with stable paths.

## Useful Commands

```bash
# Verify Cloudflare auth
wrangler whoami

# Local Workers runtime preview (closer to production than astro preview)
wrangler dev

# Live request logs from deployed worker
wrangler tail

# Check deployment status
wrangler deployments list
```
