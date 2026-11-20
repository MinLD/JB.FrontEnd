"use client";

import Image from "next/image";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown, Check, Globe, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { parseLocalePath } from "@/i18n/settings";
import { LANDING_NAV } from "@/config/landing";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

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
  const [searchQuery, setSearchQuery] = useState("");
  const langWrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const langModalRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const pathname = parseLocalePath(usePathname()).pathname;
  const { locale, setLocale, t, languages, currentLanguage } = useI18n();

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

  // Keep keyboard focus inside the modal and restore the trigger on close.
  useEffect(() => {
    if (!langModalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const modal = langModalRef.current;
    if (window.innerWidth > 900) searchInputRef.current?.focus();
    else modal?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !modal) return;
      const items = Array.from(modal.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]), input'));
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modal)) {
        event.preventDefault(); first.focus();
      }
    };
    modal?.addEventListener("keydown", trapFocus);
    return () => { modal?.removeEventListener("keydown", trapFocus); previous?.focus(); };
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

  const filteredLanguages = languages.filter(
    l =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      l.sub.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getNavLabel = (id: string, fallback: string) => {
    switch (id) {
      case "gioi-thieu":
        return t("header.nav_intro");
      case "cach-hoat-dong":
        return t("header.nav_how_it_works");
      case "faq":
        return t("header.nav_faq");
      default:
        return fallback;
    }
  };

  const renderLanguageModal = () => (
    <>
      <div
        className="lang-backdrop"
        onClick={() => setLangModalOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={langModalRef}
        tabIndex={-1}
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
            <span className="lang-modal-eyebrow">{t("header.lang_modal_eyebrow")}</span>
            <h2 id="lang-modal-title" className="lang-modal-title">{t("header.lang_modal_title")}</h2>
          </div>
          <button
            type="button"
            className="lang-modal-close"
            onClick={() => setLangModalOpen(false)}
            aria-label={t("header.lang_modal_close_aria")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="lang-modal-search">
          <Search size={16} className="lang-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            placeholder={t("header.lang_search_placeholder")}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="lang-search-input"
            aria-label={t("header.lang_search_aria")}
          />
        </div>

        <div className="lang-modal-list" role="radiogroup" aria-label={t("header.lang_list_aria")} onKeyDown={event => {
          if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
          if (!options.length) return;
          const current = options.indexOf(document.activeElement as HTMLButtonElement);
          const index = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (current + (event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1) + options.length) % options.length;
          event.preventDefault();
          options[index].click();
        }}>
          {filteredLanguages.map(lang => {
            const isSelected = locale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected || filteredLanguages.length === 1 ? 0 : -1}
                className={`lang-option ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  setLocale(lang.code);
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
            <p className="lang-no-results">{t("header.lang_no_results")}</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <header className={`site-header ${scrolled || open ? "header-scrolled" : ""}`} data-scrolled={scrolled || open}>
      <div className="header-bar">
        <Link href="/" className="brand-link" id="header-brand-link" aria-label={t("header.brand_aria")}>
          <Image id="header-brand-logo" src="/jobbod/design/131-1677-imgWordmarkOutlines.svg" alt="Jobbod" width={88.538} height={18.697} priority />
        </Link>

        <nav aria-label={t("header.main_nav_aria")} className="desktop-nav">
          {LANDING_NAV.map(item => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              aria-current={pathname === "/" && activeSection === item.id ? "location" : undefined}
            >
              {getNavLabel(item.id, item.label)}
            </Link>
          ))}
          <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>
            {t("header.nav_about_us")}
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
              aria-label={t("header.lang_trigger_aria")}
            >
              <span>{currentLanguage.short}</span>
              <ChevronDown size={14} className={`lang-chevron ${langModalOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {/* Desktop Language Modal dropdown */}
            {!open && langModalOpen && renderLanguageModal()}
          </div>

          {/* Login button - Only Login is shown */}
          {user ? (
            <Link href="/user" className="header-login-btn">
              {t("header.account")}
            </Link>
          ) : (
            <Link href="/login" className="header-login-btn">
              {t("header.login")}
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label={open ? t("header.mobile_menu_close") : t("header.mobile_menu_open")}
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
          aria-label={t("header.mobile_nav_aria")}
        >
          <div className="mobile-drawer-header">
            <Link href="/" className="brand-link" onClick={() => setOpen(false)} aria-label={t("header.brand_aria")}>
              <Image src="/jobbod/design/131-1677-imgWordmarkOutlines.svg" alt="Jobbod" width={88.538} height={18.697} />
            </Link>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={() => setOpen(false)}
              aria-label={t("header.mobile_menu_close")}
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mobile-drawer-nav" aria-label={t("header.main_nav_aria")}>
            {LANDING_NAV.map(item => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={() => setOpen(false)}
                className="mobile-drawer-link"
                aria-current={pathname === "/" && activeSection === item.id ? "location" : undefined}
              >
                {getNavLabel(item.id, item.label)}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="mobile-drawer-link"
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              {t("header.nav_about_us")}
            </Link>
          </nav>

          <div className="mobile-drawer-footer">
            <button
              type="button"
              className="mobile-drawer-lang-btn"
              onClick={handleOpenLangModal}
              aria-label={t("header.drawer_lang_aria")}
            >
              <div className="drawer-lang-left">
                <Globe size={18} aria-hidden="true" />
                <span>{t("header.drawer_lang_label")}</span>
              </div>
              <div className="drawer-lang-right">
                <span>{currentLanguage.label}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </div>
            </button>

            {user ? (
              <Link href="/user" className="mobile-drawer-login-btn" onClick={() => setOpen(false)}>
                {t("header.account")}
              </Link>
            ) : (
              <Link href="/login" className="mobile-drawer-login-btn" onClick={() => setOpen(false)}>
                {t("header.login")}
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
