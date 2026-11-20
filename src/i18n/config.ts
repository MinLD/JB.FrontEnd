import type { Locale, TranslationDictionary, TranslationKey } from "./types.ts";
import { vi } from "./locales/vi.ts";
import { en } from "./locales/en.ts";

import { DEFAULT_LOCALE } from "./settings.ts";
export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALE_COOKIE_NAME, SUPPORTED_LANGUAGES, isValidLocale } from "./settings.ts";

export const DICTIONARIES: Record<Locale, TranslationDictionary> = {
  vi,
  en,
};

export function getTranslation(locale: Locale, key: TranslationKey): string {
  const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
  const parts = key.split(".");
  let current: unknown = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      let fallback: unknown = DICTIONARIES[DEFAULT_LOCALE];
      for (const fbPart of parts) {
        if (fallback && typeof fallback === "object" && fbPart in fallback) {
          fallback = (fallback as Record<string, unknown>)[fbPart];
        } else {
          return key;
        }
      }
      return typeof fallback === "string" ? fallback : key;
    }
  }

  return typeof current === "string" ? current : key;
}
