"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DesignAsset } from "@/components/ui/design-asset";
import { designAssets } from "@/config/design-assets";
import { useAuth } from "@/providers/auth-provider";
import { AuthField } from "./auth-field";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthScreen({ mode, copyright }: { mode: "login" | "register" | "forgot"; copyright: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [registered, setRegistered] = useState(false);
  useEffect(() => { if (!loading && user) router.replace("/user"); }, [loading, user, router]);
  const title = mode === "login" ? "Đăng nhập Jobbod" : mode === "register" ? "Tạo tài khoản Jobbod" : "Quên mật khẩu?";
  return <main className={`auth-page auth-${mode}`} style={{ backgroundImage: `url("${designAssets.heroBackground.src}")`, backgroundSize: "cover", backgroundPosition: "center" }}>
    <Link href="/" className="auth-brand" aria-label="Jobbod — Trang chủ"><DesignAsset name="authWordmark" priority /></Link>
    <Link href="/" className="auth-home-link">← &nbsp; Về trang chủ</Link>
    <section className="auth-intro" aria-label="Cùng Jobbod tìm đồng đội">
      <h2>{mode === "register" ? <>Tạo hồ sơ của bạn.<br />Để Bob <em>tìm đồng đội.</em></> : <>Tìm đúng <em>đồng đội.</em><br />Cùng làm dự án.</>}</h2>
      <div className="auth-photo"><DesignAsset name={mode === "register" ? "registerPhoto" : mode === "forgot" ? "forgotPhoto" : "loginPhoto"} alt="Sinh viên NTTU cùng giới thiệu và phát triển dự án" priority sizes="(max-width: 900px) 90vw, 648px" /></div>
    </section>
    <section className="auth-content" aria-labelledby="auth-heading">
      <div className="auth-panel">
        <h1 id="auth-heading">{title}</h1>
        {mode !== "forgot" && !registered && <><Button type="button" variant="secondary" className="google-button" onClick={() => toast.info("Hệ thống hiện chưa hỗ trợ đăng nhập Google.", { id: "auth-google" })}><DesignAsset name="google" />Tiếp tục với Google</Button><div className="auth-divider"><span>hoặc dùng email</span></div></>}
        {mode === "login" ? <LoginForm /> : mode === "register" ? <RegisterForm onSuccess={() => setRegistered(true)} /> : <div className="auth-form"><AuthField label="Email" name="email" type="email" placeholder="ban@example.com" autoComplete="email" /><p className="availability-note" role="status">Hệ thống hiện chưa hỗ trợ chức năng quên mật khẩu.</p><Button type="button" disabled className="submit-button">Gửi liên kết đặt lại</Button></div>}
        {!registered && <p className="auth-bottom">{mode === "login" ? <>Chưa có tài khoản? <Link href="/register">Đăng ký</Link></> : mode === "register" ? <>Đã có tài khoản? <Link href="/login">Đăng nhập</Link></> : <Link className="auth-back-link" href="/login">← &nbsp; Quay lại đăng nhập</Link>}</p>}
      </div>
      <p className="auth-copyright">{copyright}</p>
    </section>
  </main>;
}
