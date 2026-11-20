import type { Metadata, MetadataRoute } from "next";
import { localePath, SUPPORTED_LANGUAGES } from "../i18n/settings.ts";
import type { Locale, TranslationDictionary } from "../i18n/types.ts";

export const SITE_ORIGIN = "https://jobbod.net";
export const SITE_NAME = "Jobbod";

export const SEO_PAGES = {
  home: { path: "/", indexable: true },
  about: { path: "/about", indexable: true },
  terms: { path: "/terms", indexable: true },
  privacy: { path: "/privacy", indexable: true },
  cookies: { path: "/cookies", indexable: true },
  login: { path: "/login", indexable: false },
  register: { path: "/register", indexable: false },
  forgot: { path: "/forgot-password", indexable: false },
  user: { path: "/user", indexable: false },
} as const;
export type SeoPage = keyof typeof SEO_PAGES;

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_ORIGIN}/`).href;
}

export function languageAlternates(path: string) {
  return {
    vi: absoluteUrl(localePath(path, "vi")),
    en: absoluteUrl(localePath(path, "en")),
    "x-default": absoluteUrl(localePath(path, "vi")),
  };
}

export function createPageMetadata(key: SeoPage, locale: Locale, dictionary: TranslationDictionary): Metadata {
  const page = SEO_PAGES[key];
  const canonical = absoluteUrl(localePath(page.path, locale));
  const title = dictionary.metadata[key];
  const fullTitle = key === "home" ? title : `${title} | ${SITE_NAME}`;
  const description = dictionary.metadata[`${key}_description`];
  const image = {
    url: absoluteUrl(`/jobbod/seo/social-cover-${locale}.jpg`),
    width: 1200,
    height: 630,
    alt: dictionary.metadata.share_image_alt,
  };
  return {
    title: key === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical, ...(page.indexable ? { languages: languageAlternates(page.path) } : {}) },
    robots: {
      index: page.indexable,
      follow: key !== "user",
      ...(page.indexable ? { googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } } : {}),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: canonical,
      title: fullTitle,
      description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: [locale === "vi" ? "en_US" : "vi_VN"],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

export function createSitemap(): MetadataRoute.Sitemap {
  return Object.values(SEO_PAGES).filter(page => page.indexable).flatMap(page =>
    SUPPORTED_LANGUAGES.map(language => ({
      url: absoluteUrl(localePath(page.path, language.code)),
      alternates: { languages: languageAlternates(page.path) },
    })),
  );
}

export function createRobots(): MetadataRoute.Robots {
  // Auth pages remain crawlable so their noindex metadata can be read.
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: absoluteUrl("/sitemap.xml") };
}

export function homeStructuredData(locale: Locale, dictionary: TranslationDictionary) {
  const organization = absoluteUrl("/#organization");
  const website = absoluteUrl("/#website");
  const home = absoluteUrl(localePath("/", locale));
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": organization, name: SITE_NAME, url: `${SITE_ORIGIN}/`, logo: { "@type": "ImageObject", url: absoluteUrl("/jobbod/brand-mark.png"), width: 500, height: 500 } },
      { "@type": "WebSite", "@id": website, url: `${SITE_ORIGIN}/`, name: SITE_NAME, alternateName: "Jobbod AI", inLanguage: ["vi", "en"], publisher: { "@id": organization } },
      { "@type": "WebPage", "@id": `${home}#webpage`, url: home, name: dictionary.metadata.home, description: dictionary.metadata.home_description, inLanguage: locale, isPartOf: { "@id": website }, about: { "@id": organization } },
    ],
  };
}

export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
