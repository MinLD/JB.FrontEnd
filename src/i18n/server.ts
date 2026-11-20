import "server-only";
import { locale as getRootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { isValidLocale } from "./settings";
import { createPageMetadata, type SeoPage } from "@/config/seo";
import type { Locale, TranslationDictionary } from "./types";

const dictionaries = {
  vi: () => import("./locales/vi").then(module => module.vi),
  en: () => import("./locales/en").then(module => module.en),
};

export async function getLocale(): Promise<Locale> {
  const value = await getRootLocale();
  if (!isValidLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale: Locale): Promise<TranslationDictionary> {
  return dictionaries[locale]();
}

export async function pageMetadata(key: SeoPage) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  return createPageMetadata(key, locale, dictionary);
}
