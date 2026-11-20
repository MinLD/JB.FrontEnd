import fs from "node:fs";
import sharp from "sharp";
import { vi } from "../src/i18n/locales/vi.ts";
import { en } from "../src/i18n/locales/en.ts";

const asset = (path, mime) => `data:${mime};base64,${fs.readFileSync(new URL(path, import.meta.url)).toString("base64")}`;
const mark = asset("../public/jobbod/brand-mark.png", "image/png");
const wordmark = asset("../public/jobbod/design/131-1677-imgWordmarkOutlines.svg", "image/svg+xml");
const bob = asset("../public/jobbod/design/131-2272-imgBobLinhVtMiToanThan.png", "image/png");
const escape = value => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
fs.mkdirSync(new URL("../public/jobbod/seo/", import.meta.url), { recursive: true });

for (const [locale, dictionary] of [["vi", vi], ["en", en]]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="warm" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff6d9"/></linearGradient><clipPath id="round"><rect x="72" y="64" width="80" height="80" rx="20"/></clipPath></defs>
    <rect width="1200" height="630" fill="url(#warm)"/>
    <circle cx="1050" cy="350" r="300" fill="#edbd3e" opacity=".18"/>
    <circle cx="1050" cy="350" r="226" fill="none" stroke="#edbd3e" stroke-width="2" opacity=".45"/>
    <image href="${mark}" x="72" y="64" width="80" height="80" clip-path="url(#round)"/>
    <image href="${wordmark}" x="174" y="83" width="200" height="43"/>
    <g font-family="DejaVu Sans, sans-serif" fill="#202b36">
      <text x="72" y="272" font-size="66" font-weight="700">${escape(dictionary.hero.title_line1_pre.trim())}</text>
      <text x="72" y="358" font-size="76" font-weight="700" fill="#edbd3e">${escape(dictionary.hero.title_line1_em)}</text>
      <text x="76" y="435" font-size="30">${escape(dictionary.hero.title_line2_pre + dictionary.hero.title_line2_em)}</text>
      <text x="76" y="561" font-size="24" fill="#526172">jobbod.net</text>
    </g>
    <image href="${bob}" x="827" y="175" width="308" height="400" preserveAspectRatio="xMidYMax meet"/>
    <rect y="618" width="1200" height="12" fill="#edbd3e"/>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(new URL(`../public/jobbod/seo/social-cover-${locale}.jpg`, import.meta.url).pathname);
}
console.log("Generated 1200×630 Vietnamese and English social covers.");
