import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { IntroLoader } from "@/components/layout/intro-loader";
import { getDictionary, getLocale } from "@/i18n/server";
import "../globals.css";

export function generateStaticParams() { return [{ locale: "vi" }, { locale: "en" }]; }

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(await getLocale());
  return {
  applicationName: "JobBod",
  title: { default: "JobBod", template: "%s | JobBod" },
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
            </I18nProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
