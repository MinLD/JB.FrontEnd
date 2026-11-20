import type { LanguageOption, Locale } from "./types.ts";

export const DEFAULT_LOCALE: Locale = "vi";
export const LOCALE_STORAGE_KEY = "jobbod_lang";
export const LOCALE_COOKIE_NAME = "jobbod_lang";
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "Tiếng Việt", sub: "Vietnamese", short: "VI" },
  { code: "en", label: "English", sub: "English", short: "EN" },
];

export function isValidLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

export function parseLocalePath(path: string) {
  const match = /^\/(vi|en)(?=\/|\?|#|$)/.exec(path);
  return { locale: match?.[1] as Locale | undefined, pathname: match ? path.slice(match[0].length) || "/" : path };
}

export function localePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const { pathname } = parseLocalePath(path);
  return `/${locale}${pathname.replace(/^\/(?=[?#]|$)/, "")}`;
}
