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

**Current state:** Manual `npm run deploy` from local machine.

**Recommended GitHub Actions workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

Secrets needed: `CLOUDFLARE_API_TOKEN` (create in Cloudflare Dashboard > My Profile > API Tokens > Create Token > Edit Cloudflare Workers).

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
