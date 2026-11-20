import type { TranslationKey } from "./types.ts";

export function authErrorMessage(error: { status: number; code?: string }, t: (key: TranslationKey) => string): string {
  if (error.status === 401) return t("auth.invalid_credentials");
  if (error.status === 409) return t("auth.email_exists");
  if (error.status === 429) return t("auth.rate_limit");
  if (error.status >= 500 || error.status === 0) return t("auth.service_unavailable");
  return t("auth.request_error");
}
