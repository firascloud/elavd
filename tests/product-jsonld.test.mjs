import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const sourceUrl = new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url);
      return nextResolve(sourceUrl.href, context);
    }

    return nextResolve(specifier, context);
  },
});

const { getProductJsonLd } = await import("../src/seo/product.ts");

const uuid = "b715559f-4fc1-4ec8-9b50-e539e4f3d80d";

function nodesOfType(schema, type) {
  return schema["@graph"].filter((node) => node["@type"] === type);
}

function productNode(schema) {
  const products = nodesOfType(schema, "Product");
  assert.equal(products.length, 1, "exactly one Product entity must be emitted");
  return products[0];
}

function assertPreservedPageGraph(schema, slug) {
  assert.equal(nodesOfType(schema, "BreadcrumbList").length, 1);
  const pages = nodesOfType(schema, "WebPage");
  assert.equal(pages.length, 1);
  assert.deepEqual(pages[0].mainEntity, {
    "@id": `https://elavd.com/product/${slug}/#product`,
  });
}

function assertElavdEntityUrlsUseCanonicalOrigin(schema) {
  const siteUrlPattern = /^https?:\/\/(?:www\.)?elavd\.com(?:\/|$)/;

  function visit(value) {
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item));
      return;
    }

    if (!value || typeof value !== "object") return;

    for (const [childKey, childValue] of Object.entries(value)) {
      if (
        (childKey === "url" || childKey === "@id") &&
        typeof childValue === "string" &&
        siteUrlPattern.test(childValue)
      ) {
        assert.equal(
          childValue.startsWith("https://elavd.com"),
          true,
          `${childKey} must use the canonical ELAVD origin: ${childValue}`,
        );
      }
      visit(childValue);
    }
  }

  visit(schema);
}

test("KISAN K2 emits a Product without invented commercial data", () => {
  const schema = getProductJsonLd("en", {
    id: "97f09dd6-e039-451f-b436-1348a8860983",
    slug: "kisan-k2-money-counting-machine",
    name_en: "KISAN K2 Money Counting Machine",
    name_ar: "ماكينة عد النقود KISAN K2",
    short_desc_en: "<p>The KISAN K2 is a high-performance money counting machine.</p>",
    short_desc_ar: "<p>ماكينة عد النقود KISAN K2 هي جهاز احترافي لعد وفرز النقود.</p>",
    main_image:
      "https://giomurhtsumtshqcsxwd.supabase.co/storage/v1/object/public/products/0.7708728074983624.webp",
    sku: "97f09dd6-e039-451f-b436-1348a8860983",
    price: null,
    rating: null,
    review_count: null,
    availability: null,
    brand_name_en: "Kisan",
    brand_name_ar: "kisan",
  });

  const product = productNode(schema);
  assert.equal(product.name, "KISAN K2 Money Counting Machine");
  assert.equal(
    product.description,
    "The KISAN K2 is a high-performance money counting machine.",
  );
  assert.deepEqual(product.image, [
    "https://giomurhtsumtshqcsxwd.supabase.co/storage/v1/object/public/products/0.7708728074983624.webp",
  ]);
  assert.equal(product.url, "https://elavd.com/product/kisan-k2-money-counting-machine");
  assert.deepEqual(product.brand, { "@type": "Brand", name: "Kisan" });
  assert.equal("sku" in product, false);
  assert.equal("mpn" in product, false);
  assert.equal("offers" in product, false);
  assert.equal("aggregateRating" in product, false);
  assertPreservedPageGraph(schema, "kisan-k2-money-counting-machine");
  assertElavdEntityUrlsUseCanonicalOrigin(schema);
});

test("FIN-7900 remains a Product when price and rating are absent", () => {
  const schema = getProductJsonLd("en", {
    id: "87cee997-dd11-4364-9678-29d01cbc385c",
    slug: "kisan-fin-7900-money-counting-machine",
    name_en: "Kisan FIN-7900 Money Counting Machine",
    short_desc_en: "Currency counting machine.",
    main_image:
      "https://giomurhtsumtshqcsxwd.supabase.co/storage/v1/object/public/products/0.9526995963860045.webp",
    price: 0,
  });

  const product = productNode(schema);
  assert.equal(product.name, "Kisan FIN-7900 Money Counting Machine");
  assert.equal(product.url, "https://elavd.com/product/kisan-fin-7900-money-counting-machine");
  assert.equal("offers" in product, false);
  assert.equal("sku" in product, false);
  assertPreservedPageGraph(schema, "kisan-fin-7900-money-counting-machine");
  assertElavdEntityUrlsUseCanonicalOrigin(schema);
});

test("a positive public price emits one factual SAR Offer", () => {
  const schema = getProductJsonLd("en", {
    id: "priced-product",
    slug: "priced-counter",
    name_en: "Priced Counter",
    short_desc_en: "A publicly priced counter.",
    sku: "PC-100",
    mpn: "MODEL-100",
    price: 1500,
    availability: "InStock",
  });

  const product = productNode(schema);
  assert.equal(product.sku, "PC-100");
  assert.equal(product.mpn, "MODEL-100");
  assert.deepEqual(product.offers, {
    "@type": "Offer",
    url: "https://elavd.com/product/priced-counter",
    priceCurrency: "SAR",
    price: "1500",
    availability: "https://schema.org/InStock",
    seller: { "@id": "https://elavd.com/#organization" },
  });
  assert.equal("itemCondition" in product.offers, false);
});

test("an unassigned brand and UUID-like identifiers are omitted", () => {
  const schema = getProductJsonLd("en", {
    id: uuid,
    slug: "unbranded-counter",
    name_en: "Unbranded Counter",
    full_desc_en: "Saved long description.",
    sku: ` ${uuid} `,
    mpn: uuid,
  });

  const product = productNode(schema);
  assert.equal(product.description, "Saved long description.");
  assert.equal("brand" in product, false);
  assert.equal("sku" in product, false);
  assert.equal("mpn" in product, false);
});

test("Arabic and English select saved localized content at the same canonical URL", () => {
  const input = {
    id: "localized-product",
    slug: "localized-counter",
    name_en: "Localized Counter",
    name_ar: "ماكينة عد محلية",
    full_desc_en: "English saved description.",
    full_desc_ar: "وصف عربي محفوظ.",
    brand_name_en: "Saved Brand",
    brand_name_ar: "العلامة المحفوظة",
  };
  const englishSchema = getProductJsonLd("en", input);
  const arabicSchema = getProductJsonLd("ar", input);
  const english = productNode(englishSchema);
  const arabic = productNode(arabicSchema);

  assert.equal(english.name, "Localized Counter");
  assert.equal(english.description, "English saved description.");
  assert.equal(english.brand.name, "Saved Brand");
  assert.equal(arabic.name, "ماكينة عد محلية");
  assert.equal(arabic.description, "وصف عربي محفوظ.");
  assert.equal(arabic.brand.name, "العلامة المحفوظة");
  assert.equal(english.url, "https://elavd.com/product/localized-counter");
  assert.equal(arabic.url, english.url);
  assert.equal(JSON.stringify(englishSchema).includes("www.elavd.com"), false);
  assert.equal(JSON.stringify(arabicSchema).includes("www.elavd.com"), false);
  assertElavdEntityUrlsUseCanonicalOrigin(englishSchema);
  assertElavdEntityUrlsUseCanonicalOrigin(arabicSchema);
});
