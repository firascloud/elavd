/**
 * SEO Health Monitor — elavd.com
 * Run: node scripts/seo-monitor.mjs [--url https://elavd.com] [--json]
 *
 * Checks:
 *   1.  robots.txt — must not globally block crawlers
 *   2.  sitemap.xml — must exist and have enough entries for both locales
 *   3.  JSON-LD — must be present in server-rendered HTML
 *   4.  noindex — cart / compare / favorite must be noindexed
 *   5.  hreflang — must be absolute URLs + x-default present
 *   6.  canonical — must be absolute URL
 *   7.  404 page — must return HTTP 404 + noindex meta
 *   8.  Redirect check — root domain redirects to locale
 *
 * v2 improvements:
 *   - Smarter sitemap locale detection (handles bare /en and /en/path)
 *   - Removed JSON-LD position false-positive (body position heuristic removed)
 *   - x-default check handles HTML entity encoding (&amp;)
 *   - Root redirect is INFO not FAIL (next-intl routes /en directly, not 3xx)
 *   - Description too-short threshold lowered to 40 chars (Arabic is naturally shorter)
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const BASE_URL = (() => {
  const idx = args.indexOf("--url");
  return idx !== -1 ? args[idx + 1] : "https://elavd.com";
})();
const JSON_MODE = args.includes("--json");
const LOCALES = ["en", "ar"];
const IS_LOCAL = BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1");

// localePrefix:'never' — URLs have NO /en/ or /ar/ prefix.
// acceptLang drives which locale next-intl activates for that request.
const CRITICAL_PAGES = [
  { path: "/",            acceptLang: "en", expectIndex: true,  expectJsonLd: true  },
  { path: "/",            acceptLang: "ar", expectIndex: true,  expectJsonLd: true  },
  { path: "/store",       acceptLang: "en", expectIndex: true,  expectJsonLd: true  },
  { path: "/about-us",    acceptLang: "en", expectIndex: true,  expectJsonLd: false },
  { path: "/contact-us",  acceptLang: "en", expectIndex: true,  expectJsonLd: true  },
  { path: "/cart",        acceptLang: "en", expectIndex: false, expectJsonLd: false },
  { path: "/compare",     acceptLang: "en", expectIndex: false, expectJsonLd: false },
  { path: "/favorite",    acceptLang: "en", expectIndex: false, expectJsonLd: false },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

const PASS = "✅";
const FAIL = "❌";
const WARN = "⚠️ ";

let results = [];
let passCount = 0;
let failCount = 0;
let warnCount = 0;

function record(level, category, check, detail = "") {
  results.push({ level, category, check, detail, ts: new Date().toISOString() });
  if (level === "PASS") passCount++;
  else if (level === "FAIL") failCount++;
  else if (level === "WARN") warnCount++;
}

async function fetchText(url, opts = {}) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "elavd-seo-monitor/1.0" },
      signal: AbortSignal.timeout(30000), // 30s — Turbopack needs time on first compile
      ...opts,
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, headers: res.headers, url: res.url };
  } catch (e) {
    return { ok: false, status: 0, text: "", headers: new Headers(), url, error: e.message };
  }
}

// Decode HTML entities for accurate text comparison
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ─── Check 1: robots.txt ─────────────────────────────────────────────────────

async function checkRobots() {
  const cat = "robots.txt";
  const { ok, text, status } = await fetchText(`${BASE_URL}/robots.txt`);

  if (!ok) {
    // Locally, robots.txt always fails because sitemap.ts calls Supabase (no prod env).
    // Treat as WARN on localhost, FAIL on production.
    const level = IS_LOCAL ? "WARN" : "FAIL";
    record(level, cat, "robots.txt is reachable",
      IS_LOCAL ? `HTTP ${status} (expected locally — Supabase env vars not set)` : `HTTP ${status}`);
    if (IS_LOCAL) record("WARN", cat, "Skipping robots checks", "Run seo:check against production for accurate results");
    return;
  }
  record("PASS", cat, "robots.txt is reachable", `HTTP ${status}`);

  // Must NOT contain global disallow
  if (/^Disallow:\s*\/\s*$/m.test(text)) {
    record("FAIL", cat, "No global Disallow: /", "Found 'Disallow: /' — site is blocked from all crawlers!");
  } else {
    record("PASS", cat, "No global Disallow: /");
  }

  // Sitemap directive present
  if (/^Sitemap:/mi.test(text)) {
    const sitemapUrl = text.match(/^Sitemap:\s*(.+)$/mi)?.[1]?.trim();
    record("PASS", cat, "Sitemap directive present", sitemapUrl);
  } else {
    // Not always a failure — some hosts strip headers. Warn, don't fail.
    record("WARN", cat, "Sitemap directive present", "No Sitemap: line found — add sitemap URL to robots.ts");
  }

  // User-state pages disallowed
  const userStateBlocked = ["/cart", "/compare", "/favorite"].every((p) => text.includes(p));
  if (userStateBlocked) {
    record("PASS", cat, "User-state pages disallowed");
  } else {
    record("WARN", cat, "User-state pages disallowed", "cart / compare / favorite not in disallow list");
  }
}

// ─── Check 2: XML Sitemap ────────────────────────────────────────────────────

async function checkSitemap() {
  const cat = "Sitemap";
  const { ok, text, status } = await fetchText(`${BASE_URL}/sitemap.xml`);

  if (!ok) {
    const level = IS_LOCAL ? "WARN" : "FAIL";
    record(level, cat, "sitemap.xml reachable",
      IS_LOCAL ? `HTTP ${status} (expected locally — Supabase env vars not set)` : `HTTP ${status}`);
    if (IS_LOCAL) record("WARN", cat, "Skipping sitemap checks", "Run seo:check against production for accurate results");
    return;
  }
  record("PASS", cat, "sitemap.xml reachable", `HTTP ${status}`);

  const urlCount = (text.match(/<loc>/g) || []).length;
  if (urlCount < 20) {
    record("FAIL", cat, "Sitemap has enough URLs", `Only ${urlCount} URLs — expected 20+`);
  } else {
    record("PASS", cat, "Sitemap has enough URLs", `${urlCount} URLs found`);
  }

  // Locale presence — sitemap uses /en/ and /ar/ paths for hreflang even when
  // localePrefix:'never' is set (hreflang spec requires absolute locale URLs).
  // Next.js internally rewrites the URL, so /en/... and /ar/... are valid targets.
  for (const l of LOCALES) {
    const hasLocale =
      text.includes(`/${l}/`) ||             // /en/store, /ar/product/...
      new RegExp(`elavd\\.com/${l}[<"&\\s]`).test(text) || // bare locale root
      text.includes(`/${l}\n`);
    if (hasLocale) {
      record("PASS", cat, `Locale /${l}/ entries in sitemap`);
    } else {
      record("FAIL", cat, `Locale /${l}/ entries in sitemap`, "Missing locale entries — check sitemap.ts");
    }
  }

  // x-default
  if (text.includes("x-default")) {
    record("PASS", cat, "x-default hreflang present");
  } else {
    record("WARN", cat, "x-default hreflang present", "No x-default found in sitemap alternates");
  }

  // Absolute URLs only
  const strippedProtocol = text.replace(/<loc>https?:\/\//g, "<loc>REPLACED/");
  if (!/<loc>\//.test(strippedProtocol)) {
    record("PASS", cat, "All URLs are absolute");
  } else {
    record("FAIL", cat, "All URLs are absolute", "Found relative URLs in <loc> tags");
  }
}

// ─── Check 3 & 4: Page-level checks ─────────────────────────────────────────

async function checkPage({ path, acceptLang = "en", expectIndex, expectJsonLd }) {
  const url = `${BASE_URL}${path}`;
  const cat = `Page: ${path} [${acceptLang}]`;
  const { ok, text, status } = await fetchText(url, {
    headers: {
      "User-Agent": "elavd-seo-monitor/1.0",
      "Accept-Language": `${acceptLang},${acceptLang === "ar" ? "en" : "ar"};q=0.8`,
    },
  });

  if (!ok) {
    record("FAIL", cat, "HTTP 2xx", `Got HTTP ${status}`);
    return;
  }
  record("PASS", cat, "HTTP 2xx", `HTTP ${status}`);

  const decoded = decodeEntities(text);

  // ── noindex / index check ───────────────────────────────────────────────────
  // Next.js renders: <meta name="robots" content="noindex,nofollow"/>
  const hasNoindex = /noindex/i.test(decoded);
  if (expectIndex) {
    hasFailed => hasNoindex
      ? record("FAIL", cat, "Page is indexable", "Found noindex — page should be indexed")
      : record("PASS", cat, "Page is indexable");
    if (hasNoindex) record("FAIL", cat, "Page is indexable", "Found noindex — page should be indexed");
    else record("PASS", cat, "Page is indexable");
  } else {
    if (hasNoindex) record("PASS", cat, "User-state page is noindexed");
    else record("FAIL", cat, "User-state page is noindexed", "Missing noindex — user-state page should NOT be indexed");
  }

  // ── JSON-LD check ───────────────────────────────────────────────────────────
  // We simply check presence — no position heuristic (body layout varies)
  if (expectJsonLd) {
    if (decoded.includes("application/ld+json")) {
      record("PASS", cat, "JSON-LD present in HTML");
    } else {
      record("FAIL", cat, "JSON-LD present in HTML", "No application/ld+json found in server HTML");
    }
  }

  // ── hreflang checks (indexable pages only) ──────────────────────────────────
  if (expectIndex) {
    // Next.js renders hreflang as: <link rel="alternate" hreflang="en" href="..."/>
    const linkHreflang = [...decoded.matchAll(/<link[^>]+hreflang[^>]*>/gi)];

    if (linkHreflang.length === 0) {
      record("WARN", cat, "hreflang tags present", "No hreflang <link> tags found");
    } else {
      record("PASS", cat, "hreflang tags present", `${linkHreflang.length} found`);

      // x-default — Next.js may render as hreflang="x-default" or hreflang='x-default'
      if (/hreflang=["']x-default["']/i.test(decoded)) {
        record("PASS", cat, "x-default hreflang present");
      } else {
        record("WARN", cat, "x-default hreflang present",
          "Missing x-default hreflang — check buildLanguageAlternates() in metadata/utils.ts");
      }

      // All hreflang hrefs must be absolute
      const relativeHreflang = linkHreflang.some((m) => {
        const hrefMatch = m[0].match(/href=["']([^"']+)["']/i);
        return hrefMatch && !hrefMatch[1].startsWith("http");
      });
      if (relativeHreflang) {
        record("FAIL", cat, "hreflang URLs are absolute", "Found relative URLs — must be absolute https://…");
      } else {
        record("PASS", cat, "hreflang URLs are absolute");
      }
    }

    // canonical
    const canonicalMatch =
      decoded.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
      decoded.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
    if (!canonicalMatch) {
      record("WARN", cat, "Canonical tag present", "No canonical <link> tag found");
    } else if (!canonicalMatch[1].startsWith("http")) {
      record("FAIL", cat, "Canonical URL is absolute", `Got relative: ${canonicalMatch[1]}`);
    } else {
      record("PASS", cat, "Canonical URL is absolute", canonicalMatch[1]);
    }
  }

  // ── title tag ──────────────────────────────────────────────────────────────
  const titleMatch = decoded.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    record("FAIL", cat, "Title tag present", "Missing or empty <title>");
  } else {
    const title = titleMatch[1].trim();
    // Avoid double site-name false positive: strip it before checking length
    const titleCore = title.replace(/\s*\|\s*Elavd\s*/gi, "").trim();
    if (titleCore.length < 3) {
      record("WARN", cat, "Title tag quality", `Core title too short or empty: "${titleCore}"`);
    } else if (title.length > 70) {
      record("WARN", cat, "Title tag length", `Too long (${title.length} chars): "${title.slice(0, 60)}…"`);
    } else {
      record("PASS", cat, "Title tag", `"${title}" (${title.length} chars)`);
    }
  }

  // ── meta description ───────────────────────────────────────────────────────
  // Arabic descriptions are naturally shorter — use 40 char minimum
  const descMatch =
    decoded.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    decoded.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i);
  if (!descMatch) {
    record("WARN", cat, "Meta description present", "No meta description found");
  } else if (descMatch[1].length < 40) {
    record("WARN", cat, "Meta description length",
      `Short (${descMatch[1].length} chars) — aim for 120-160: "${descMatch[1]}"`);
  } else {
    record("PASS", cat, "Meta description present", `${descMatch[1].length} chars`);
  }
}

// ─── Check 5: 404 behavior ───────────────────────────────────────────────────

async function check404() {
  const cat = "404 handling";
  const { status, text } = await fetchText(
    `${BASE_URL}/this-page-definitely-does-not-exist-seo-test-xyz`,
    { redirect: "follow" }
  );

  if (status === 404) {
    record("PASS", cat, "Unknown URL returns HTTP 404", `HTTP ${status}`);
  } else {
    record(
      "FAIL", cat, "Unknown URL returns HTTP 404",
      `Got HTTP ${status} — soft-404! Fix: add notFound() to [...slug]/page.tsx`
    );
  }

  const hasNoindex = /noindex/i.test(text);
  if (hasNoindex) {
    record("PASS", cat, "404 page has noindex meta");
  } else {
    record("FAIL", cat, "404 page has noindex meta", "Add robots: { index: false } to not-found.tsx metadata");
  }
}

// ─── Check 6: Root behavior ───────────────────────────────────────────────────
// next-intl redirects via middleware — may be immediate 200 with locale prefix
// or 307 redirect depending on deployment. Treat both as acceptable.

async function checkRootRedirect() {
  const cat = "Root behavior";
  try {
    // First check with redirect:manual to detect 3xx
    const res = await fetch(BASE_URL, {
      redirect: "manual",
      headers: { "User-Agent": "elavd-seo-monitor/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    const loc = res.headers.get("location") || "";

    if (res.status >= 300 && res.status < 400) {
      record("PASS", cat, `Root → locale redirect (HTTP ${res.status})`, `→ ${loc}`);
    } else if (res.status === 200) {
      // next-intl prefix-always mode serves /en directly without redirect
      record("PASS", cat, "Root behavior", `HTTP ${res.status} — next-intl may handle routing internally`);
    } else {
      record("WARN", cat, "Root behavior", `Unexpected HTTP ${res.status}`);
    }
  } catch (e) {
    record("WARN", cat, "Root redirect check", `Fetch failed: ${e.message}`);
  }
}

// ─── Run all checks ───────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();

  if (!JSON_MODE) {
    console.log(`\n🔍 SEO Health Monitor — ${BASE_URL}`);
    console.log(`🕐 ${new Date().toUTCString()}\n`);
    console.log("─".repeat(60));
  }

  await checkRobots();
  await checkSitemap();
  await check404();
  await checkRootRedirect();

  // Run page checks SEQUENTIALLY — parallel hits overwhelm Turbopack on first compile
  for (const page of CRITICAL_PAGES) {
    await checkPage(page);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  if (JSON_MODE) {
    console.log(JSON.stringify({
      site: BASE_URL,
      timestamp: new Date().toISOString(),
      summary: { pass: passCount, fail: failCount, warn: warnCount, total: results.length },
      elapsed_s: parseFloat(elapsed),
      results,
    }, null, 2));
    process.exit(failCount > 0 ? 1 : 0);
  }

  // ── Human-readable report ─────────────────────────────────────────────────
  let currentCat = "";
  for (const r of results) {
    if (r.category !== currentCat) {
      console.log(`\n📋 ${r.category}`);
      currentCat = r.category;
    }
    const icon = r.level === "PASS" ? PASS : r.level === "FAIL" ? FAIL : WARN;
    const detail = r.detail ? `  → ${r.detail}` : "";
    console.log(`  ${icon} ${r.check}${detail}`);
  }

  console.log("\n" + "─".repeat(60));
  console.log(`\n📊 Summary (${elapsed}s)`);
  console.log(`   ${PASS} Passed  : ${passCount}`);
  console.log(`   ${FAIL} Failed  : ${failCount}`);
  console.log(`   ${WARN} Warnings: ${warnCount}`);

  if (failCount === 0 && warnCount === 0) {
    console.log("\n✨ Perfect score — all checks passed!\n");
  } else if (failCount === 0) {
    console.log(`\n✅ No critical failures. ${warnCount} warning(s) to review.\n`);
  } else {
    console.log(`\n🚨 ${failCount} critical issue(s) found — deploy fixes before next crawl!\n`);
  }

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
