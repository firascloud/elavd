# SEO Monitoring System — elavd.com

## Quick Start

```bash
# Check live site (https://elavd.com)
npm run seo:check

# Check local dev server (make sure npm run dev is running)
npm run seo:check:local

# JSON output (for CI pipelines)
npm run seo:check:json
```

## What It Checks

| Category | Checks |
|---|---|
| **robots.txt** | Reachable · No global `Disallow: /` · Sitemap directive · User-state pages blocked |
| **Sitemap** | Reachable · 20+ URLs · Both `/en/` and `/ar/` locales · `x-default` · Absolute URLs |
| **Page: /en, /ar** | HTTP 200 · Indexable · JSON-LD in HTML · hreflang absolute + x-default · Canonical absolute · Title length · Meta description |
| **User-state pages** | `/cart`, `/compare`, `/favorite` — must have `noindex` |
| **404 handling** | Broken URLs return HTTP 404 (not 200 soft-404) · 404 page is noindexed |
| **Root redirect** | Domain root redirects to a locale path |

## Automated Weekly Report (GitHub Actions)

The workflow runs every **Monday at 08:00 UTC**.

1. Push the repo to GitHub
2. Go to **Actions** tab → see `🔍 Weekly SEO Health Monitor`
3. Each run produces:
   - A **Summary tab** with pass/fail/warn counts and failed check details
   - A downloadable `seo-report-{run}.json` artifact (kept 90 days)
   - ❌ Workflow fails (red) if any critical check fails

### Enable Alerts (optional)

Add secrets to the repo and uncomment the notification step in `.github/workflows/seo-monitor.yml`:

| Alert method | Secret(s) needed |
|---|---|
| Slack | `SLACK_WEBHOOK_URL` |
| Email (SendGrid) | `SENDGRID_API_KEY`, `ALERT_EMAIL` |

### Manual trigger

Actions tab → `🔍 Weekly SEO Health Monitor` → **Run workflow** button

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | All critical checks passed |
| `1` | One or more critical checks failed |

## Understanding Local vs. Production Results

When running against `localhost:3000`:
- **robots.txt / sitemap.xml may return 500** — these call Supabase which requires prod env vars. This is expected locally.
- **Page timeouts** — pages that haven't been compiled yet by Turbopack respond slowly on first hit.
- **JSON-LD position warning** — in dev mode Next.js may inject scripts differently than production.

Always run `npm run seo:check` (against the live deployed site) for accurate results.

## Adding New Checks

Edit `scripts/seo-monitor.mjs`:

```javascript
// Add to CRITICAL_PAGES array:
{ path: "/en/new-page", expectIndex: true, expectJsonLd: true },

// Or add a new check function:
async function checkMyThing() {
  const { text } = await fetchText(`${BASE_URL}/some-url`);
  if (text.includes("expected")) record("PASS", "My Check", "thing is present");
  else record("FAIL", "My Check", "thing is present", "not found in HTML");
}
// Then call it inside main()
```

## External Tools (run manually)

| Tool | Use |
|---|---|
| [Google Search Console](https://search.google.com/search-console) | Index coverage, CWV field data, hreflang errors |
| [Rich Results Test](https://search.google.com/test/rich-results) | Validate Product / BreadcrumbList / ContactPage schema |
| [Schema Markup Validator](https://validator.schema.org) | Full schema graph validation |
| [PageSpeed Insights](https://pagespeed.web.dev) | LCP, CLS, INP per URL |
| [hreflang Checker](https://www.hreflang.org/checker/) | Validate all hreflang pairs |
