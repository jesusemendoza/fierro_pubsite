# Domain Migration Guide

Migrating `getfierro.com` from Vercel (fierro_web app) to Cloudflare Workers (fierro_pubsite marketing site).

After migration:
- `getfierro.com` -- Marketing site (this repo, Cloudflare Workers)
- `app.getfierro.com` -- Web app (fierro_web, Vercel)

## Pre-Migration Checklist

- [ ] Marketing site fully built and tested (`npm run build` succeeds)
- [ ] `wrangler deploy` tested with a staging/preview deployment
- [ ] All marketing site pages verified (/, /pricing, /why-fierro, /privacy, /terms)
- [ ] DNS is managed in Cloudflare (domain already on Cloudflare)
- [ ] Vercel project for fierro_web is accessible
- [ ] Supabase Dashboard access confirmed
- [ ] OAuth provider console access confirmed (Google, etc.)
- [ ] Stripe Dashboard access confirmed
- [ ] Rollback plan understood (see bottom of this doc)

## Step 1: Deploy Marketing Site to Cloudflare Workers

```bash
# From fierro_pubsite repo
npm run deploy
```

This creates the Worker and sets up the custom domain route for `getfierro.com`. Cloudflare will automatically configure DNS for the custom domain once deployed.

Verify: `curl -I https://getfierro.com` should return the marketing site (may take a few minutes for DNS propagation).

## Step 2: Configure app.getfierro.com on Vercel

In Cloudflare DNS, add:
```
app.getfierro.com  CNAME  cname.vercel-dns.com  (proxied or DNS-only)
```

In Vercel Dashboard (fierro_web project) > Settings > Domains:
1. Remove `getfierro.com` as primary domain
2. Add `app.getfierro.com` as primary domain
3. Vercel will verify the CNAME and issue SSL

Update environment variable in Vercel:
```
NEXT_PUBLIC_APP_URL=https://app.getfierro.com  (was https://getfierro.com)
```

Redeploy fierro_web for env var changes to take effect.

## Step 3: Update Supabase Auth Redirect URLs

In Supabase Dashboard > Authentication > URL Configuration:

**Site URL:**
```
https://app.getfierro.com  (was https://getfierro.com)
```

**Redirect URLs** -- add all `app.getfierro.com` variants:
```
https://app.getfierro.com/**
https://app.getfierro.com/auth/callback
https://app.getfierro.com/auth/confirm
https://app.getfierro.com/login
https://app.getfierro.com/signup
```

Keep `https://getfierro.com/**` temporarily during transition, remove after verification.

**Email templates** -- check that any hardcoded URLs in Supabase email templates (confirmation, password reset, magic link) use `{{ .SiteURL }}` variable rather than hardcoded domains. If hardcoded, update to `app.getfierro.com`.

## Step 4: Update OAuth Provider Callback URLs

For each OAuth provider configured in Supabase:

### Google OAuth
Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client:
- **Authorized redirect URIs:** Change `https://getfierro.com` references to `https://app.getfierro.com`
- Keep the Supabase callback URL format: `https://<project-ref>.supabase.co/auth/v1/callback`
- Add: `https://app.getfierro.com/auth/callback` if using client-side redirects

### Other Providers
Same pattern -- find the OAuth app settings in each provider's console and update redirect URIs from `getfierro.com` to `app.getfierro.com`.

## Step 5: Update Stripe Webhook URLs

In Stripe Dashboard > Developers > Webhooks:

If webhook endpoint URL contains the domain:
```
Old: https://getfierro.com/api/stripe/webhook
New: https://app.getfierro.com/api/stripe/webhook
```

After updating:
1. Verify the webhook signing secret hasn't changed (it shouldn't)
2. Send a test webhook event from Stripe Dashboard
3. Confirm it's received by fierro_web (check Stripe Dashboard > Webhooks > Recent deliveries)

If using the Supabase/serverless function endpoint instead, the URL may not change -- verify.

## Step 6: Update Environment Variables

In fierro_web (Vercel environment variables):

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| `NEXT_PUBLIC_APP_URL` | `https://getfierro.com` | `https://app.getfierro.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://getfierro.com` (if exists) | `https://app.getfierro.com` |
| `NEXTAUTH_URL` | `https://getfierro.com` (if exists) | `https://app.getfierro.com` |

Search fierro_web codebase for any other hardcoded `getfierro.com` references (without `app.` prefix) that should be updated:
```bash
grep -r "getfierro.com" --include="*.ts" --include="*.tsx" --include="*.env*" | grep -v "app.getfierro.com" | grep -v node_modules
```

Redeploy fierro_web after all env var changes.

## Post-Migration Verification Checklist

- [ ] `getfierro.com` loads the marketing site (not the app)
- [ ] `getfierro.com/pricing` loads correctly with working CTAs
- [ ] `app.getfierro.com` loads the app login page
- [ ] Login with email/password works (Supabase auth redirect succeeds)
- [ ] OAuth login works (Google callback URL resolves)
- [ ] Signup from marketing site CTA (`getfierro.com/pricing` "Get Started" button) lands on `app.getfierro.com/signup`
- [ ] Signup with plan params works (`app.getfierro.com/signup?plan=plus&billing=monthly`)
- [ ] Stripe webhooks fire successfully (check Stripe Dashboard > Webhooks > Recent deliveries)
- [ ] Email confirmation links resolve correctly (click through from email)
- [ ] Password reset flow completes end-to-end
- [ ] `https://getfierro.com/sitemap-index.xml` returns valid sitemap
- [ ] Social sharing previews work (test with https://cards-dev.twitter.com/validator or similar)

## Rollback Plan

If something breaks after migration:

1. **Revert DNS:** In Cloudflare DNS, point `getfierro.com` back to Vercel (`cname.vercel-dns.com` or the original A record)
2. **Revert Vercel domain:** In fierro_web Vercel settings, re-add `getfierro.com` as primary domain, remove `app.getfierro.com`
3. **Revert Supabase:** Change Site URL back to `https://getfierro.com`, revert redirect URLs
4. **Revert OAuth:** Update callback URLs back to `getfierro.com`
5. **Revert Stripe:** Update webhook URL back if changed
6. **Revert env vars:** Change `NEXT_PUBLIC_APP_URL` back, redeploy

DNS changes may take up to 24 hours to fully propagate, but Cloudflare-managed domains typically resolve within minutes.

## Timeline Expectations

- DNS propagation: Minutes (Cloudflare-managed) to 24 hours (external)
- Vercel domain verification: ~1-5 minutes
- Supabase changes: Immediate
- OAuth provider changes: Immediate to ~10 minutes (Google can cache)
- Stripe webhook changes: Immediate

**Recommended:** Do the migration during low-traffic hours. Have both old and new URLs in Supabase redirect allowlist during transition.
