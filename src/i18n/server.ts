import "server-only";
import { locale as getRootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { isValidLocale, localePath } from "./settings";
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

export async function pageMetadata(key: keyof TranslationDictionary["metadata"], path: string) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  return {
    title: key === "home" ? { absolute: dictionary.metadata.home } : dictionary.metadata[key],
    ...(key === "user" ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: localePath(path, locale),
      languages: { vi: localePath(path, "vi"), en: localePath(path, "en"), "x-default": localePath(path, "vi") },
    },
  };
}
