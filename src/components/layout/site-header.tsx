"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown, Check, Globe, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { LANDING_NAV } from "@/config/landing";
import { useAuth } from "@/providers/auth-provider";

type LanguageCode = "vi" | "en";

interface LanguageOption {
  code: LanguageCode;
  label: string;
  sub: string;
  short: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "Tiếng Việt", sub: "Vietnamese", short: "VI" },
  { code: "en", label: "English", sub: "English", short: "EN" },
];

const emptySubscribe = () => () => {};

export function SiteHeader() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("gioi-thieu");
  const [scrolled, setScrolled] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>("vi");
  const [searchQuery, setSearchQuery] = useState("");
  const langWrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  // Lock background scroll when drawer or language modal is open
  useEffect(() => {
    if (open || langModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open, langModalOpen]);

  // Handle ESC key to dismiss dialogs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (langModalOpen) {
          setLangModalOpen(false);
        } else if (open) {
          setOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [langModalOpen, open]);

  // Focus search input when language modal opens (desktop only to prevent mobile keyboard layout shift)
  useEffect(() => {
    if (langModalOpen) {
      if (typeof window !== "undefined" && window.innerWidth > 900) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [langModalOpen]);

  const touchStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 75) {
      setLangModalOpen(false);
    }
    setDragOffset(0);
    touchStartY.current = null;
  };

  const handleOpenLangModal = () => {
    setSearchQuery("");
    setDragOffset(0);
    setLangModalOpen(true);
  };

  const filteredLanguages = LANGUAGES.filter(
    l =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      l.sub.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const renderLanguageModal = () => (
    <>
      <div
        className="lang-backdrop"
        onClick={() => setLangModalOpen(false)}
        aria-hidden="true"
      />
      <div
        className="lang-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
        style={dragOffset > 0 ? { transform: `translateY(${dragOffset}px)`, transition: "none" } : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bottom-sheet-handle" aria-hidden="true" />
        <div className="lang-modal-header">
          <div>
            <span className="lang-modal-eyebrow">NGÔN NGỮ HIỂN THỊ</span>
            <h2 id="lang-modal-title" className="lang-modal-title">Chọn ngôn ngữ</h2>
          </div>
          <button
            type="button"
            className="lang-modal-close"
            onClick={() => setLangModalOpen(false)}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="lang-modal-search">
          <Search size={16} className="lang-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Tìm ngôn ngữ"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="lang-search-input"
            aria-label="Tìm ngôn ngữ"
          />
        </div>

        <div className="lang-modal-list" role="radiogroup" aria-label="Danh sách ngôn ngữ">
          {filteredLanguages.map(lang => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`lang-option ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  setCurrentLang(lang.code);
                  setLangModalOpen(false);
                }}
              >
                <div className="lang-option-text">
                  <span className="lang-option-title">{lang.label}</span>
                  <span className="lang-option-sub">{lang.sub}</span>
                </div>
                {isSelected && <Check size={18} className="lang-option-check" aria-hidden="true" />}
              </button>
            );
          })}
          {filteredLanguages.length === 0 && (
            <p className="lang-no-results">Không tìm thấy ngôn ngữ phù hợp</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <header className={`site-header ${scrolled || open ? "header-scrolled" : ""}`} data-scrolled={scrolled || open}>
      <div className="header-bar">
        <Link href="/" className="brand-link" id="header-brand-link" aria-label="Jobbod — Trang chủ">
          <Image id="header-brand-logo" src="/jobbod/design/131-1677-imgWordmarkOutlines.svg" alt="Jobbod" width={88.538} height={18.697} priority />
        </Link>

        <nav aria-label="Điều hướng chính" className="desktop-nav">
          {LANDING_NAV.map(item => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              aria-current={pathname === "/" && activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>
            Về chúng tôi
          </Link>
        </nav>

        <div className="header-actions">
          {/* Language trigger on desktop */}
          <div className="header-lang-wrapper" ref={langWrapperRef}>
            <button
              type="button"
              className="header-lang-trigger"
              onClick={() => (langModalOpen ? setLangModalOpen(false) : handleOpenLangModal())}
              aria-expanded={langModalOpen}
              aria-haspopup="dialog"
              aria-label="Chọn ngôn ngữ"
            >
              <span>{currentLangObj.short}</span>
              <ChevronDown size={14} className={`lang-chevron ${langModalOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {/* Desktop Language Modal dropdown */}
            {!open && langModalOpen && renderLanguageModal()}
          </div>

          {/* Login button - Only Login is shown */}
          {user ? (
            <Link href="/user" className="header-login-btn">
              Tài khoản
            </Link>
          ) : (
            <Link href="/login" className="header-login-btn">
              Đăng nhập
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Navigation Drawer via portal */}
      {mounted && open && createPortal(
        <div
          id="mobile-navigation"
          className="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng trên điện thoại"
        >
          <div className="mobile-drawer-header">
            <Link href="/" className="brand-link" onClick={() => setOpen(false)} aria-label="Jobbod — Trang chủ">
              <Image src="/jobbod/design/131-1677-imgWordmarkOutlines.svg" alt="Jobbod" width={88.538} height={18.697} />
            </Link>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={() => setOpen(false)}
              aria-label="Đóng menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mobile-drawer-nav" aria-label="Điều hướng chính">
            {LANDING_NAV.map(item => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={() => setOpen(false)}
                className="mobile-drawer-link"
                aria-current={pathname === "/" && activeSection === item.id ? "location" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="mobile-drawer-link"
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              Về chúng tôi
            </Link>
          </nav>

          <div className="mobile-drawer-footer">
            <button
              type="button"
              className="mobile-drawer-lang-btn"
              onClick={handleOpenLangModal}
              aria-label="Chọn ngôn ngữ hiển thị"
            >
              <div className="drawer-lang-left">
                <Globe size={18} aria-hidden="true" />
                <span>Ngôn ngữ hiển thị</span>
              </div>
              <div className="drawer-lang-right">
                <span>{currentLangObj.label}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </div>
            </button>

            {user ? (
              <Link href="/user" className="mobile-drawer-login-btn" onClick={() => setOpen(false)}>
                Tài khoản
              </Link>
            ) : (
              <Link href="/login" className="mobile-drawer-login-btn" onClick={() => setOpen(false)}>
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile Language Modal rendered inside Drawer */}
          {langModalOpen && renderLanguageModal()}
        </div>,
        document.body
      )}
    </header>
  );
}
