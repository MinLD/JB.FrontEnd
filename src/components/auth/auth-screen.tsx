"use client";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DesignAsset } from "@/components/ui/design-asset";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { frostedBackgroundStyle } from "@/config/design-assets";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { AuthField } from "./auth-field";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthScreen({ mode, copyright }: { mode: "login" | "register" | "forgot"; copyright: ReactNode }) {
  const { user, loading } = useAuth();
  const { t, href } = useI18n();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.replace(href("/user")); }, [loading, user, router, href]);
  const title = t(mode === "login" ? "auth.login_title" : mode === "register" ? "auth.register_title" : "auth.forgot_title");
  return <main className={`auth-page auth-${mode} frosted-background`} style={frostedBackgroundStyle}>
    <Link href="/" className="auth-brand inline-flex items-center" aria-label={t("header.brand_aria")}><DesignAsset name="authWordmark" priority /></Link>
    <div className="auth-language-switcher flex items-center gap-2"><ThemeToggle /><LanguageSwitcher /></div>
    <section className="auth-intro" aria-label={t("auth.intro_aria")}>
      <h2>{mode === "register" ? <>{t("auth.intro_profile")}<br />{t("auth.intro_bob")}<em>{t("auth.intro_match")}</em></> : <>{t("auth.intro_find")}<em>{t("auth.intro_teammates")}</em><br />{t("auth.intro_project")}</>}</h2>
      <div className="auth-photo"><DesignAsset name={mode === "register" ? "registerPhoto" : mode === "forgot" ? "forgotPhoto" : "loginPhoto"} alt={t("auth.photo_alt")} priority sizes="(max-width: 900px) 90vw, 648px" /></div>
    </section>
    <section className="auth-content" aria-labelledby="auth-heading">
      <div className="auth-panel">
        <h1 id="auth-heading">{title}</h1>
        {mode !== "forgot" && <><Button type="button" variant="secondary" className="google-button" onClick={() => toast.info(t("auth.google_unavailable"), { id: "auth-google" })}><DesignAsset name="google" />{t("auth.google")}</Button><div className="auth-divider"><span>{t("auth.email_divider")}</span></div></>}
        {mode === "login" ? <Suspense fallback={null}><LoginForm /></Suspense> : mode === "register" ? <RegisterForm /> : <div className="auth-form"><AuthField label={t("auth.email")} name="email" type="email" placeholder={t("auth.email_placeholder")} autoComplete="email" /><p className="availability-note" role="status">{t("auth.forgot_unavailable")}</p><Button type="button" disabled className="submit-button">{t("auth.send_reset")}</Button></div>}
        <p className="auth-bottom">{mode === "login" ? <>{t("auth.no_account")} <Link href="/register">{t("auth.signup")}</Link></> : mode === "register" ? <>{t("auth.has_account")} <Link href="/login">{t("auth.login")}</Link></> : <Link className="auth-back-link" href="/login">← &nbsp; {t("auth.back_login")}</Link>}</p>
      </div>
      <p className="auth-copyright">{copyright}</p>
    </section>
  </main>;
}
