import type { TranslationDictionary, TranslationKey } from "./types.ts";

export function translate(dictionary: TranslationDictionary, key: TranslationKey, values: Record<string, string | number> = {}): string {
  let value: unknown = dictionary;
  for (const part of key.split(".")) {
    if (!value || typeof value !== "object" || !Object.hasOwn(value, part)) return key;
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === "string" ? value.replace(/\{(\w+)\}/g, (match, name: string) => Object.hasOwn(values, name) ? String(values[name]) : match) : key;
}
