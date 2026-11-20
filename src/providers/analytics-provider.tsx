"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { ANALYTICS_CHOICE_KEY, MEASUREMENT_CONFIG_PATH, measurementId, type MeasurementConfig } from "@/config/measurement";
import { analyticsChoice, startAnalytics, stopAnalytics, trackAnalytics, trackPage } from "@/lib/analytics";
import { clientApi } from "@/services/client-api";
import { LocalizedLink } from "@/components/layout/localized-link";
import { useI18n } from "@/providers/i18n-provider";

export function AnalyticsProvider() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [id, setId] = useState<string | null>(null);
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const enabled = Boolean(id && choice === "granted");

  useEffect(() => {
    let cancelled = false;
    void clientApi<MeasurementConfig>(MEASUREMENT_CONFIG_PATH).then(result => {
      if (cancelled || !result.success) return;
      setId(measurementId(result.data.measurementId ?? undefined));
      setChoice(analyticsChoice());
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (enabled && id && startAnalytics(id)) trackPage(pathname);
  }, [enabled, id, pathname]);

  useEffect(() => {
    if (!enabled) return;
    const onError = () => trackAnalytics("app_error", { error_type: "javascript" });
    const onRejection = () => trackAnalytics("app_error", { error_type: "unhandled_rejection" });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [enabled]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CHOICE_KEY && event.key !== null) return;
      const next = analyticsChoice();
      if (next !== "granted" && stopAnalytics()) window.location.reload();
      setChoice(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function choose(next: "granted" | "denied") {
    try { localStorage.setItem(ANALYTICS_CHOICE_KEY, next); } catch {}
    setChoice(next);
    setSettingsOpen(false);
    if (next === "denied" && stopAnalytics()) window.location.reload();
  }

  if (!id) return null;
  return <>
    {enabled && <>
      <Script id="jobbod-analytics-bootstrap" strategy="afterInteractive" onReady={() => { if (id && startAnalytics(id)) trackPage(window.location.pathname); }}>
        {"window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};"}
      </Script>
      <Script id="jobbod-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>}
    {choice === null || settingsOpen ? <aside className="analytics-banner" aria-label={t("analytics.title")}>
      <h2>{t("analytics.title")}</h2>
      <p>{t("analytics.description")} <LocalizedLink href="/cookies">{t("analytics.learn_more")}</LocalizedLink></p>
      <div className="analytics-actions">
        <button type="button" onClick={() => choose("denied")}>{t("analytics.decline")}</button>
        <button type="button" onClick={() => choose("granted")}>{t("analytics.accept")}</button>
      </div>
    </aside> : <button type="button" className="analytics-settings" onClick={() => setSettingsOpen(true)}>{t("analytics.settings")}</button>}
  </>;
}
