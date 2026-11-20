"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { LogOut, LoaderCircle } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/utils/cn";
import { useI18n } from "@/providers/i18n-provider";

export type AppHeaderProps = {
  center?: ReactNode;
  onLogout?: () => void;
  loggingOut?: boolean;
  className?: string;
};

export function AppHeader({
  center,
  onLogout,
  loggingOut = false,
  className,
}: AppHeaderProps) {
  const { t } = useI18n();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-[#eef0f2] bg-white/95 backdrop-blur-sm transition-colors",
        className,
      )}
    >
      <div className="mx-auto flex h-[58px] sm:h-[64px] max-w-[1440px] items-center justify-between px-3 sm:px-6 lg:px-12 gap-2 sm:gap-4">
        {/* Left: Jobbod Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label={t("header.brand_aria")}
          >
            <Image
              src="/jobbod/brand-mark.png"
              alt=""
              width={32}
              height={32}
              sizes="32px"
              preload
              className="shrink-0 rounded-lg"
            />
            <Image
              src="/jobbod/design/131-1677-imgWordmarkOutlines.svg"
              alt="Jobbod"
              width={82}
              height={17.3}
              priority
              className="w-[74px] sm:w-[88px] h-auto"
            />
          </Link>
        </div>

        {/* Center: Stepper (scrollable or flexibly centered on mobile) */}
        {center && (
          <div className="flex min-w-0 items-center justify-center px-1 overflow-x-auto no-scrollbar">
            {center}
          </div>
        )}

        {/* Right: Logout Action */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <LanguageSwitcher />
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#526172] hover:text-[#20211e] transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-1"
              aria-label={t("header.logout_aria")}
            >
              <span className="hidden sm:inline">{t("header.logout")}</span>
              {loggingOut ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <LogOut size={15} />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
