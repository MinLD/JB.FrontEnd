"use client";
import { useI18n } from "@/providers/i18n-provider";
import { authErrorMessage } from "@/i18n/auth-errors";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AUTH_LIMITS, createAuthSchemas, type RegisterFields } from "@/lib/validations/auth";
import { register } from "@/services/auth-service";
import { AuthField, showValidationError } from "./auth-field";
import { trackAnalytics } from "@/lib/analytics";

export function RegisterForm() {
  const router = useRouter();
  const { t, href } = useI18n();
  const schemas = useMemo(() => createAuthSchemas(t), [t]);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterFields>({ resolver: zodResolver(schemas.registerSchema), reValidateMode: "onChange", defaultValues: { full_name: "", email: "", password: "" } });
  const submit = form.handleSubmit(async values => {
    setError(null);
    trackAnalytics("sign_up_attempt");
    const result = await register(values.full_name, values.email, values.password);
    if (!result.success) {
      trackAnalytics("auth_error", { action: "register", error_type: "request_failed" });
      setError(authErrorMessage(result, t));
      toast.error(authErrorMessage(result, t), { id: "auth-request" });
      return;
    }
    form.reset();
    trackAnalytics("sign_up");
    toast.success(t("auth.registered"), { id: "auth-register" });
    router.replace(href(`/login?email=${encodeURIComponent(values.email)}`));
  }, errors => showValidationError(errors, t("auth.check_fields")));
  return <form onSubmit={submit} className="auth-form" noValidate>
    <AuthField label={t("auth.full_name")} placeholder={t("auth.name_placeholder")} autoComplete="name" minLength={AUTH_LIMITS.nameMin} {...form.register("full_name")} validationAttempt={form.formState.submitCount} error={form.formState.errors.full_name?.message} />
    <AuthField label={t("auth.email")} type="email" placeholder={t("auth.email_placeholder")} autoComplete="email" {...form.register("email")} validationAttempt={form.formState.submitCount} error={form.formState.errors.email?.message} />
    <AuthField label={t("auth.password")} type="password" placeholder={t("auth.new_password_placeholder")} autoComplete="new-password" minLength={AUTH_LIMITS.passwordMin} {...form.register("password")} validationAttempt={form.formState.submitCount} error={form.formState.errors.password?.message} />
    {error && <p role="alert" className="form-error">{error}</p>}
    <Button type="submit" className="submit-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <LoaderCircle size={18} className="animate-spin" />}{t("auth.register")}</Button>
  </form>;
}
