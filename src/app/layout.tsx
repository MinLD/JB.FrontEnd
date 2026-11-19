import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { IntroLoader } from "@/components/layout/intro-loader";
import "./globals.css";
export const metadata: Metadata = {
  applicationName: "JobBod",
  title: { default: "JobBod", template: "%s | JobBod" },
  description:
    "Đồng hành cùng sinh viên trong mọi dự án học tập và hành trình sự nghiệp.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
          <AuthProvider>
            <IntroLoader />
            {children}
            <ToastProvider />
          </AuthProvider>
      </body>
    </html>
  );
}
