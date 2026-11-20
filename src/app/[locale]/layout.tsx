import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { IntroLoader } from "@/components/layout/intro-loader";
import { getDictionary, getLocale } from "@/i18n/server";
import { SITE_NAME, SITE_ORIGIN } from "@/config/seo";
import { googleVerification } from "@/config/measurement";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import "../globals.css";

export function generateStaticParams() { return [{ locale: "vi" }, { locale: "en" }]; }

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(await getLocale());
  return {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE_NAME,
  verification: { google: googleVerification(process.env.JOBBOD_GOOGLE_SITE_VERIFICATION) },
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description:
    dictionary.metadata.description,
  };
}
export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  return (
    <html lang={locale}>
      <body>
          <noscript><style>{".intro-loader-overlay{display:none!important}"}</style></noscript>
          <AuthProvider>
            <I18nProvider locale={locale} dictionary={dictionary}>
              <IntroLoader />
              {children}
              <ToastProvider />
              <AnalyticsProvider />
            </I18nProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
