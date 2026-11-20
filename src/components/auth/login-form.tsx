"use client";
import { useI18n } from "@/providers/i18n-provider";
import { authErrorMessage } from "@/i18n/auth-errors";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createAuthSchemas, type LoginFields } from "@/lib/validations/auth";
import { login } from "@/services/auth-service";
import { useAuth } from "@/providers/auth-provider";
import { AuthField, showValidationError } from "./auth-field";
import { trackAnalytics } from "@/lib/analytics";

export function LoginForm() {
  const router = useRouter();
  const { t, href } = useI18n();
  const schemas = useMemo(() => createAuthSchemas(t), [t]);
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const { reload } = useAuth();
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFields>({ resolver: zodResolver(schemas.loginSchema), reValidateMode: "onChange", defaultValues: { email: "", password: "" } });
  const { setValue } = form;
  useEffect(() => {
    if (initialEmail) setValue("email", initialEmail);
  }, [initialEmail, setValue]);
  const submit = form.handleSubmit(async values => {
    setError(null);
    const result = await login(values.email, values.password, remember);
    if (!result.success) {
      trackAnalytics("auth_error", { action: "login", error_type: "request_failed" });
      setError(authErrorMessage(result, t));
      toast.error(authErrorMessage(result, t), { id: "auth-request" });
      return;
    }
    const session = await reload();
    if (!session.success) {
      trackAnalytics("auth_error", { action: "login", error_type: "session_failed" });
      setError(authErrorMessage(session, t));
      toast.error(authErrorMessage(session, t), { id: "auth-request" });
      return;
    }
    trackAnalytics("login");
    router.replace(href("/user"));
  }, errors => showValidationError(errors, t("auth.check_fields")));
  return <form onSubmit={submit} className="auth-form" noValidate>
    <AuthField label={t("auth.email")} type="email" placeholder={t("auth.email_placeholder")} autoComplete="email" {...form.register("email")} validationAttempt={form.formState.submitCount} error={form.formState.errors.email?.message} />
    <AuthField label={t("auth.password")} type="password" placeholder={t("auth.password_placeholder")} autoComplete="current-password" {...form.register("password")} validationAttempt={form.formState.submitCount} error={form.formState.errors.password?.message} />
    <div className="form-options"><label className="check-label"><Checkbox checked={remember} onCheckedChange={value => setRemember(value === true)} />{t("auth.remember")}</label><Link href="/forgot-password">{t("auth.forgot")}</Link></div>
    {error && <p role="alert" className="form-error">{error}</p>}
    <Button type="submit" className="submit-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <LoaderCircle size={18} className="animate-spin" />}{t("auth.login")}</Button>
  </form>;
}
