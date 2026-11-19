"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CircleCheck,
  LoaderCircle,
  LogOut,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { useAuth } from "@/providers/auth-provider";
import { logout, refreshSession } from "@/services/auth-service";
export function UserScreen() {
  const { user, loading, error, reload } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (loading) return;
    if (!user && !error) {
      router.replace("/login");
      return;
    }
  }, [user, loading, error, router]);
  async function refresh() {
    setBusy(true);
    setNotice(null);
    const refreshed = await refreshSession();
    if (!refreshed.success) setNotice(refreshed.message);
    else setNotice(`Làm mới phiên thành công lúc ${new Date().toLocaleTimeString("vi-VN")}.`);
    setBusy(false);
  }
  async function signOut() {
    setBusy(true);
    setNotice(null);
    const result = await logout();
    if (result.success) router.replace("/login");
    else setNotice(result.message);
    setBusy(false);
  }
  if (loading)
    return (
      <>
        <SiteHeader />
        <main className="session-state" role="status">
          <LoaderCircle className="animate-spin" />
          Đang xác thực tài khoản…
        </main>
      </>
    );
  if (error)
    return (
      <>
        <SiteHeader />
        <main className="session-state">
          <p role="alert">{error}</p>
          <Button onClick={() => void reload()}>Thử lại</Button>
        </main>
      </>
    );
  if (!user)
    return (
      <>
        <SiteHeader />
        <main className="session-state">Đang chuyển đến đăng nhập…</main>
      </>
    );
  return (
    <>
      <SiteHeader />
      <main className="user-main">
        <div className="user-heading">
          <span className="portal-label">
            <UserRound size={16} />
            Tài khoản đã xác thực
          </span>
          <h1>Không gian người dùng</h1>
          <p>Chào mừng bạn đến với hành trình học tập và sự nghiệp cùng Bob.</p>
        </div>
        <section className="user-card">
          <div className="profile-top">
            <div className="profile-avatar">
              {user.full_name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2>Xin chào, {user.full_name}</h2>
              <p>{user.email}</p>
            </div>
            <span className="session-badge">
              <CircleCheck size={15} />
              Đã đăng nhập
            </span>
          </div>
          <dl className="profile-details">
            <div>
              <dt>Họ và tên</dt>
              <dd>{user.full_name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Ngày tham gia</dt>
              <dd>{new Date(user.created_at).toLocaleDateString("vi-VN")}</dd>
            </div>
            <div className="full-row">
              <dt>Mã tài khoản</dt>
              <dd>{user.id}</dd>
            </div>
          </dl>
          <div className="session-actions">
            <Button onClick={refresh} disabled={busy}>
              <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
              Làm mới phiên
            </Button>
            <Button variant="secondary" onClick={signOut} disabled={busy}>
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </div>
          {notice && (
            <p className="session-notice" role="status">
              {notice}
            </p>
          )}
        </section>
      </main>
    </>
  );
}
