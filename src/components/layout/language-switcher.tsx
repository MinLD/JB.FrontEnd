"use client";

import { useI18n } from "@/providers/i18n-provider";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

export function LanguageSwitcher() {
  const { locale, setLocale, languages, currentLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const filtered = languages.filter(language => normalizeSearch(`${language.label} ${language.sub} ${language.short}`).includes(normalizeSearch(query)));

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return <div className="language-switcher" ref={wrapperRef}>
    <button ref={triggerRef} type="button" className="header-lang-trigger" aria-label={t("header.lang_trigger_aria")} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => {
      setQuery("");
      setOpen(!open);
    }}>
      <span>{currentLanguage.short}</span>
      <ChevronDown size={14} className={`lang-chevron ${open ? "rotate-180" : ""}`} aria-hidden="true" />
    </button>
    {open && <div id={id} className="language-switcher-panel" role="dialog" aria-labelledby={`${id}-title`}>
      <div className="lang-modal-header">
        <div>
          <span className="lang-modal-eyebrow">{t("header.lang_modal_eyebrow")}</span>
          <h2 className="lang-modal-title" id={`${id}-title`}>{t("header.lang_modal_title")}</h2>
        </div>
        <button type="button" className="lang-modal-close" aria-label={t("header.lang_modal_close_aria")} onClick={() => close(true)}><X size={16} aria-hidden="true" /></button>
      </div>
      <div className="lang-modal-search">
        <Search size={16} className="lang-search-icon" aria-hidden="true" />
        <input ref={searchRef} type="search" className="lang-search-input" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("header.lang_search_placeholder")} aria-label={t("header.lang_search_aria")} />
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
        {filtered.map(language => <button key={language.code} type="button" role="radio" aria-checked={locale === language.code} tabIndex={locale === language.code || filtered.length === 1 ? 0 : -1} className={`lang-option ${locale === language.code ? "selected" : ""}`} onClick={() => {
          close(true);
          setLocale(language.code);
        }}>
          <span className="lang-option-text"><span className="lang-option-title" lang={language.code}>{language.label}</span><span className="lang-option-sub">{language.sub}</span></span>
          {locale === language.code && <Check size={18} className="lang-option-check" aria-hidden="true" />}
        </button>)}
        {!filtered.length && <p className="lang-no-results">{t("header.lang_no_results")}</p>}
      </div>
    </div>}
  </div>;
}
