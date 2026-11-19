import { z } from "zod";

export const AUTH_LIMITS = {
  emailMax: 254,
  nameMin: 2,
  nameMax: 255,
  passwordMin: 8,
  passwordMax: 128,
} as const;
const emailSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập email.")
  .max(AUTH_LIMITS.emailMax, `Email tối đa ${AUTH_LIMITS.emailMax} ký tự.`)
  .pipe(z.email("Email không hợp lệ."));
const passwordSchema = z
  .string()
  .min(1, "Vui lòng nhập mật khẩu.")
  .max(
    AUTH_LIMITS.passwordMax,
    `Mật khẩu tối đa ${AUTH_LIMITS.passwordMax} ký tự.`,
  );
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
// Shared by FE route handlers: a direct API request cannot bypass the limits.
export const registerAccountSchema = loginSchema.extend({
  full_name: z
    .string()
    .trim()
    .min(
      AUTH_LIMITS.nameMin,
      `Họ và tên cần ít nhất ${AUTH_LIMITS.nameMin} ký tự.`,
    )
    .max(AUTH_LIMITS.nameMax, `Họ và tên tối đa ${AUTH_LIMITS.nameMax} ký tự.`),
  password: passwordSchema.min(
    AUTH_LIMITS.passwordMin,
    `Mật khẩu cần ít nhất ${AUTH_LIMITS.passwordMin} ký tự.`,
  ),
});
export const registerSchema = registerAccountSchema;
export type LoginFields = z.infer<typeof loginSchema>;
export type RegisterFields = z.infer<typeof registerSchema>;
