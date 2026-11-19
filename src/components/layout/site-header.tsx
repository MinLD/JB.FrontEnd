"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LANDING_NAV } from "@/config/landing";
import { useAuth } from "@/providers/auth-provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("gioi-thieu");
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);
      if (pathname === "/") {
        const marker = window.innerHeight * 0.35;
        let active: string = LANDING_NAV[0].id;
        for (const item of LANDING_NAV) {
          const section = document.getElementById(item.id);
          if (section && section.getBoundingClientRect().top <= marker) active = item.id;
        }
        setActiveSection(active);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [pathname]);
  return <header className={`site-header ${scrolled || open ? "header-scrolled" : ""}`} data-scrolled={scrolled || open}>
    <div className="header-bar">
      <Link href="/" className="brand-link" id="header-brand-link" aria-label="Jobbod — Trang chủ">
        <Image id="header-brand-logo" src="/jobbod/design/131-1677-imgWordmarkOutlines.svg" alt="Jobbod" width={88.538} height={18.697} priority />
      </Link>
      <nav aria-label="Điều hướng chính" className="desktop-nav">{LANDING_NAV.map(item => <Link key={item.id} href={`/#${item.id}`} aria-current={pathname === "/" && activeSection === item.id ? "location" : undefined}>{item.label}</Link>)}</nav>
      <div className="header-actions">
        {user ? <Button asChild size="sm" className="header-signup"><Link href="/user">Tài khoản</Link></Button> : <><Link href="/login" className="header-login">Đăng nhập</Link><Button asChild size="sm" className="header-signup"><Link href="/register">Đăng ký</Link></Button></>}
        <Button variant="ghost" size="icon" className="mobile-toggle" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</Button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Điều hướng trên điện thoại">{LANDING_NAV.map(item => <Link key={item.id} href={`/#${item.id}`} onClick={() => setOpen(false)} aria-current={pathname === "/" && activeSection === item.id ? "location" : undefined}>{item.label}</Link>)}</nav>}
  </header>;
}
