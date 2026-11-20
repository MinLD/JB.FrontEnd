export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "jobbod_theme";

export function getNextTheme(currentResolved: ResolvedTheme): ResolvedTheme {
  return currentResolved === "dark" ? "light" : "dark";
}
