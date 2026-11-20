import { ANALYTICS_CHOICE_KEY, measurementId } from "../config/measurement.ts";
import { SITE_ORIGIN } from "../config/seo.ts";

type AnalyticsEvent = "sign_up_click" | "sign_up_attempt" | "sign_up" | "login" | "auth_error" | "app_error";
type EventDetails = {
  action?: "login" | "register";
  error_type?: "request_failed" | "session_failed" | "javascript" | "unhandled_rejection";
};
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let activeId: string | null = null;
let lastPage: string | null = null;

/** Only known static routes; never forward queries, fragments or arbitrary profile slugs. */
export function measurementPage(pathname: string): string | null {
  return /^\/(vi|en)(\/(about|privacy|terms|cookies|login|register|forgot-password|user))?\/?$/.test(pathname)
    ? pathname.replace(/\/$/, "") : null;
}

export function referrerOrigin(value: string): string {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.origin : "";
  } catch { return ""; }
}

export function analyticsChoice(): "granted" | "denied" | null {
  try {
    const choice = localStorage.getItem(ANALYTICS_CHOICE_KEY);
    return choice === "granted" || choice === "denied" ? choice : null;
  } catch { return null; }
}

function pageDetails(pathname = window.location.pathname) {
  const page = measurementPage(pathname);
  return page ? {
    page_location: `${SITE_ORIGIN}${page}`,
    page_referrer: referrerOrigin(document.referrer),
    page_title: "Jobbod",
    language: page.startsWith("/en") ? "en" : "vi",
  } : null;
}

export function startAnalytics(id: string): boolean {
  if (!measurementId(id) || typeof window === "undefined") return false;
  if (activeId === id) return true;
  try {
    const details = pageDetails();
    if (!details || !window.gtag) return false;
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "none",
      ...details,
    });
    activeId = id;
    lastPage = null;
    return true;
  } catch { return false; }
}

export function trackPage(pathname: string) {
  const page = measurementPage(pathname);
  if (!activeId || !page || page === lastPage) return;
  try {
    window.gtag?.("event", "page_view", { send_to: activeId, ...pageDetails(pathname) });
    lastPage = page;
  } catch { /* Measurement must never interrupt navigation. */ }
}

export function trackAnalytics(event: AnalyticsEvent, details: EventDetails = {}) {
  if (!activeId || typeof window === "undefined") return;
  const page = pageDetails();
  if (!page) return;
  // Construct an allowlist instead of forwarding arbitrary caller objects or error messages.
  const parameters = {
    ...page, send_to: activeId,
    ...(["sign_up", "login", "sign_up_attempt"].includes(event) ? { method: "email" } : {}),
    ...(details.action === "login" || details.action === "register" ? { action: details.action } : {}),
    ...(["request_failed", "session_failed", "javascript", "unhandled_rejection"].includes(details.error_type ?? "") ? { error_type: details.error_type } : {}),
  };
  try { window.gtag?.("event", event, parameters); } catch {}
}

/** Disable the loaded tag before reloading into an unmeasured document. */
export function stopAnalytics(): boolean {
  if (!activeId) return false;
  (window as unknown as Record<string, unknown>)[`ga-disable-${activeId}`] = true;
  activeId = null;
  lastPage = null;
  try {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (/^_ga(?:_|$)/.test(name)) document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  } catch { /* Cookie storage can be blocked independently of localStorage. */ }
  return true;
}
