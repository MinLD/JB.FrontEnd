"use client";

import { useTheme } from "@/providers/theme-provider";
import { useI18n } from "@/providers/i18n-provider";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const label = isDark ? t("header.theme_light") : t("header.theme_dark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? "is-dark" : "is-light"} ${className || ""}`}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        <Sun className="theme-icon theme-sun-icon" size={19} />
        <Moon className="theme-icon theme-moon-icon" size={19} />
      </span>
    </button>
  );
}
