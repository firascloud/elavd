import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const outputDir = new URL("../public/", import.meta.url);
const logoSource = new URL("../src/assets/logo.webp", import.meta.url);
const logoSourcePath = fileURLToPath(logoSource);

await mkdir(outputDir, { recursive: true });
await copyFile(logoSource, new URL("logo.webp", outputDir));

const logo = await sharp(logoSourcePath)
  .resize({ width: 780, withoutEnlargement: false })
  .toBuffer();

const background = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#eef2f3"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ef5354"/>
        <stop offset="1" stop-color="#44c7a2"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="1100" cy="-40" r="270" fill="#44c7a2" opacity="0.10"/>
    <circle cx="80" cy="650" r="310" fill="#ef5354" opacity="0.10"/>
    <rect x="0" y="606" width="1200" height="24" fill="url(#accent)"/>
  </svg>
`);

await sharp(background)
  .composite([{ input: logo, gravity: "center" }])
  .webp({ quality: 90, effort: 6 })
  .toFile(fileURLToPath(new URL("og-image.webp", outputDir)));

console.log("Generated public/logo.webp and public/og-image.webp");
