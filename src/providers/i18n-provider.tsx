"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY, SUPPORTED_LANGUAGES, isValidLocale, localePath } from "@/i18n/settings";
import { translate } from "@/i18n/translate";
import type { LanguageOption, Locale, TranslationDictionary, TranslationKey } from "@/i18n/types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
  href: (path: string) => string;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
};
const I18nContext = createContext<I18nContextValue | null>(null);

function persistLocale(locale: Locale) {
  // Storage can fail independently; the URL works without either mechanism.
  try { localStorage.setItem(LOCALE_STORAGE_KEY, locale); } catch {}
  try {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  } catch {}
}

export function I18nProvider({ children, locale, dictionary }: { children: ReactNode; locale: Locale; dictionary: TranslationDictionary }) {
  const router = useRouter();
  const setLocale = useCallback((next: Locale) => {
    if (!isValidLocale(next) || next === locale) return;
    persistLocale(next);
    router.replace(localePath(`${window.location.pathname}${window.location.search}${window.location.hash}`, next), { scroll: false });
  }, [locale, router]);

  useEffect(() => {
    document.documentElement.lang = locale;
    persistLocale(locale);
    const onStorage = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY && isValidLocale(event.newValue) && event.newValue !== locale) {
        router.replace(localePath(`${window.location.pathname}${window.location.search}${window.location.hash}`, event.newValue), { scroll: false });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [locale, router]);

  const t = useCallback((key: TranslationKey, values?: Record<string, string | number>) => translate(dictionary, key, values), [dictionary]);
  const href = useCallback((path: string) => localePath(path, locale), [locale]);
  const value = useMemo(() => ({ locale, setLocale, t, href, languages: SUPPORTED_LANGUAGES, currentLanguage: SUPPORTED_LANGUAGES.find(language => language.code === locale)! }), [locale, setLocale, t, href]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n requires I18nProvider");
  return value;
}
export const useTranslation = useI18n;
