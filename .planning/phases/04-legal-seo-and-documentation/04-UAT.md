---
status: complete
phase: 04-legal-seo-and-documentation
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md]
started: 2026-03-10T05:00:00Z
updated: 2026-03-10T05:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Privacy Policy Page
expected: Navigate to /privacy. Page shows a dark Gunmetal header band with "Privacy Policy" title and effective date. Below, legal content renders in a clean prose layout (~65ch line width) with 12 sections including "Information We Collect", "CCPA Rights", and "AI/MCP Server Data Access". Links appear in Molten Orange. Contact email is privacy@getfierro.com.
result: pass
note: Fixed inline — changed contact email to support@getfierro.com (5 occurrences) and dashboard link to https://app.getfierro.com per user feedback. Commit 6a10bca.

### 2. Terms of Service Page
expected: Navigate to /terms. Page shows a dark Gunmetal header band with "Terms of Service" title and effective date. Below, legal content renders in the same prose layout with 17 sections including "Eligibility", "Subscription/Payments", "AI/MCP Disclaimer", and "Arbitration". Contact email is support@getfierro.com.
result: pass

### 3. Page Meta Tags (Unique Per Page)
expected: View page source for each of the 5 pages (/, /pricing, /why-fierro, /privacy, /terms). Each has a unique `<title>` tag ending with "| Fierro" and a unique `<meta name="description">` with builder-voice copy. No two pages share the same title or description.
result: pass

### 4. OG Tags and Social Sharing Images
expected: View page source for any page. OG tags are present: og:title, og:description, og:image (absolute URL like https://getfierro.com/og/home.png), og:url, og:type. Twitter card tags also present (twitter:card=summary_large_image, twitter:title, twitter:description, twitter:image). Navigate directly to /og/home.png — a branded 1200x630 image appears with Gunmetal background and text.
result: pass

### 5. JSON-LD Structured Data
expected: View page source on the home page (/). A `<script type="application/ld+json">` tag is present containing a @graph with Organization (name: Fierro, url, logo, description) and SoftwareApplication (name: Fierro, 3 pricing offers for Free/$0, Plus/$49, Builder/custom, featureList array). JSON is valid (no escaped entities like &quot;).
result: pass
note: Verified via curl — @graph contains Organization + SoftwareApplication, 3 offers, 7 features, valid JSON.

### 6. Sitemap Generation
expected: Run `npm run build` and check the dist/ output. A sitemap-index.xml and sitemap-0.xml exist in dist/. The sitemap contains URLs for all 5 pages (/, /pricing, /why-fierro, /privacy, /terms). robots.txt references the sitemap.
result: pass

### 7. robots.txt and llms.txt
expected: Navigate to /robots.txt — shows "User-agent: *", "Allow: /", and a Sitemap directive. Navigate to /llms.txt — shows a markdown-formatted file with Fierro description, page listing with URLs, and an "AI Integration" section mentioning MCP server.
result: pass

### 8. Deployment Documentation
expected: Open docs/DEPLOYMENT.md. Contains Cloudflare Workers Static Assets setup, build commands (`astro build`, `wrangler deploy`), custom domain config, and a CI/CD workflow section. Written for small team audience — concise, command-focused.
result: pass

### 9. Migration Documentation
expected: Open docs/MIGRATION.md. Contains 6 sequential steps: DNS changes, Vercel domain update, Supabase auth redirects, OAuth callbacks, Stripe webhooks, env vars. Includes pre-migration and post-migration verification checklists and a rollback plan.
result: pass

### 10. Deep-Link Signup Flow Doc
expected: Open ../fierro_web/docs/plans/deep-link-signup-flow.md. Describes the query-param-based signup flow (?plan=<tier>&billing=<cycle>), Stripe Checkout integration points, MCP server access gating, and edge case handling.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
