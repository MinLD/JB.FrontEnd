"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AUTH_LIMITS, registerSchema, type RegisterFields } from "@/lib/validations/auth";
import { register } from "@/services/auth-service";
import { AuthField, showValidationError } from "./auth-field";

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<RegisterFields>({ resolver: zodResolver(registerSchema), reValidateMode: "onChange", defaultValues: { full_name: "", email: "", password: "" } });
  const submit = form.handleSubmit(async values => {
    setError(null);
    const result = await register(values.full_name, values.email, values.password);
    if (!result.success) {
      setError(result.message);
      toast.error(result.message, { id: "auth-request" });
      return;
    }
    setSuccess(true);
    onSuccess();
    form.reset();
  }, showValidationError);
  if (success) return <div className="auth-form"><p role="status" className="success-message">Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản vừa tạo.</p><Button asChild className="submit-button"><Link href="/login">Đăng nhập</Link></Button></div>;
  return <form onSubmit={submit} className="auth-form" noValidate>
    <AuthField label="Họ và tên" placeholder="Tên của bạn" autoComplete="name" minLength={AUTH_LIMITS.nameMin} {...form.register("full_name")} validationAttempt={form.formState.submitCount} error={form.formState.errors.full_name?.message} />
    <AuthField label="Email" type="email" placeholder="ban@example.com" autoComplete="email" {...form.register("email")} validationAttempt={form.formState.submitCount} error={form.formState.errors.email?.message} />
    <AuthField label="Mật khẩu" type="password" placeholder="Ít nhất 8 ký tự" autoComplete="new-password" minLength={AUTH_LIMITS.passwordMin} {...form.register("password")} validationAttempt={form.formState.submitCount} error={form.formState.errors.password?.message} />
    {error && <p role="alert" className="form-error">{error}</p>}
    <Button type="submit" className="submit-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <LoaderCircle size={18} className="animate-spin" />}Tạo tài khoản</Button>
  </form>;
}
