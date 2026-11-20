import { z } from "zod";
import type { TranslationKey } from "../../i18n/types.ts";

export const AUTH_LIMITS = { emailMax: 254, nameMin: 2, nameMax: 255, passwordMin: 8, passwordMax: 128 } as const;

const defaults = {
  "auth.email_required": "Vui lòng nhập email.",
  "auth.email_max": "Email tối đa 254 ký tự.",
  "auth.email_invalid": "Email không hợp lệ.",
  "auth.password_required": "Vui lòng nhập mật khẩu.",
  "auth.password_max": "Mật khẩu tối đa 128 ký tự.",
  "auth.password_min": "Mật khẩu cần ít nhất 8 ký tự.",
  "auth.name_min": "Họ và tên cần ít nhất 2 ký tự.",
  "auth.name_max": "Họ và tên tối đa 255 ký tự.",
} as const;

type ValidationKey = keyof typeof defaults & TranslationKey;
export function createAuthSchemas(t: (key: ValidationKey) => string = key => defaults[key]) {
  const email = z.string().trim().min(1, t("auth.email_required")).max(AUTH_LIMITS.emailMax, t("auth.email_max")).pipe(z.email(t("auth.email_invalid")));
  const password = z.string().min(1, t("auth.password_required")).max(AUTH_LIMITS.passwordMax, t("auth.password_max"));
  const loginSchema = z.object({ email, password });
  const registerSchema = loginSchema.extend({
    full_name: z.string().trim().min(AUTH_LIMITS.nameMin, t("auth.name_min")).max(AUTH_LIMITS.nameMax, t("auth.name_max")),
    password: password.min(AUTH_LIMITS.passwordMin, t("auth.password_min")),
  });
  return { loginSchema, registerSchema };
}
// API handlers keep the same validation and limits as the localized forms.
export const { loginSchema, registerSchema } = createAuthSchemas();
export const registerAccountSchema = registerSchema;
export type LoginFields = z.infer<typeof loginSchema>;
export type RegisterFields = z.infer<typeof registerSchema>;
