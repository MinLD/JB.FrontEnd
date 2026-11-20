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
import { ThemeProvider } from "@/providers/theme-provider";
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("jobbod_theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark");}else{document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-theme","light");}var m=document.querySelector('meta[name="color-scheme"]');if(m)m.content=d?"dark":"light";}catch(e){}})();`,
          }}
        />
      </head>
      <body>
          <noscript><style>{".intro-loader-overlay{display:none!important}"}</style></noscript>
          <AuthProvider>
            <I18nProvider locale={locale} dictionary={dictionary}>
              <ThemeProvider>
                <IntroLoader />
                {children}
                <ToastProvider />
                <AnalyticsProvider />
              </ThemeProvider>
            </I18nProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
