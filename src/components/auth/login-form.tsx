"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFields } from "@/lib/validations/auth";
import { login } from "@/services/auth-service";
import { useAuth } from "@/providers/auth-provider";
import { AuthField, showValidationError } from "./auth-field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const { reload } = useAuth();
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFields>({ resolver: zodResolver(loginSchema), reValidateMode: "onChange", defaultValues: { email: "", password: "" } });
  const { setValue } = form;
  useEffect(() => {
    if (initialEmail) setValue("email", initialEmail);
  }, [initialEmail, setValue]);
  const submit = form.handleSubmit(async values => {
    setError(null);
    const result = await login(values.email, values.password, remember);
    if (!result.success) {
      setError(result.message);
      toast.error(result.message, { id: "auth-request" });
      return;
    }
    const session = await reload();
    if (!session.success) {
      setError(session.message);
      toast.error(session.message, { id: "auth-request" });
      return;
    }
    router.replace("/user");
  }, showValidationError);
  return <form onSubmit={submit} className="auth-form" noValidate>
    <AuthField label="Email" type="email" placeholder="ban@example.com" autoComplete="email" {...form.register("email")} validationAttempt={form.formState.submitCount} error={form.formState.errors.email?.message} />
    <AuthField label="Mật khẩu" type="password" placeholder="Nhập mật khẩu của bạn" autoComplete="current-password" {...form.register("password")} validationAttempt={form.formState.submitCount} error={form.formState.errors.password?.message} />
    <div className="form-options"><label className="check-label"><Checkbox checked={remember} onCheckedChange={value => setRemember(value === true)} />Ghi nhớ tôi</label><Link href="/forgot-password">Quên mật khẩu?</Link></div>
    {error && <p role="alert" className="form-error">{error}</p>}
    <Button type="submit" className="submit-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <LoaderCircle size={18} className="animate-spin" />}Đăng nhập</Button>
  </form>;
}
