"use client";

import type { ReactNode } from "react";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { ArrowUpRight } from "lucide-react";
import { DesignAsset } from "@/components/ui/design-asset";
import { designAssets } from "@/config/design-assets";
import { ScaledScene } from "./scaled-scene";
import { StartLink } from "./start-link";
import { MissionDialog } from "./mission-dialog";
import { useI18n } from "@/providers/i18n-provider";

const wordmarkLetters = [
  ["letter-j", "footerJ"],
  ["letter-o-one", "footerO"],
  ["letter-b-one", "footerB"],
  ["letter-b-two", "footerB"],
  ["letter-o-two", "footerO"],
  ["letter-d", "footerD"],
] as const;

export function SiteFooter({
  compact = false,
  copyright,
}: {
  compact?: boolean;
  copyright?: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <footer className={`site-footer${compact ? " footer-compact" : ""}`}>
      <div className="footer-main page-container">
        {!compact && (
          <>
            <div className="footer-invitation">
              <div>
                <p className="eyebrow">{t("footer.eyebrow")}</p>
                <h2>
                  {t("footer.heading_line1")}
                  <br />
                  <em>{t("footer.heading_line2")}</em>
                </h2>
              </div>
              <div>
                <p>
                  {t("footer.description_line1")}
                  <br />
                  {t("footer.description_line2")}
                </p>
                <StartLink>
                  {t("footer.find_teammates")}{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </StartLink>
              </div>
            </div>
            <div className="footer-divider" />
            <div className="footer-wordmark" role="img" aria-label="Jobbod">
              <ScaledScene width={827} height={197}>
                {wordmarkLetters.map(([position, asset]) => (
                  <span className={`wordmark-letter ${position}`} key={position}>
                    <span className="wordmark-glyph">
                      <DesignAsset
                        name={asset}
                        style={{
                          width: designAssets[asset].width,
                          height: designAssets[asset].height,
                        }}
                      />
                    </span>
                  </span>
                ))}
              </ScaledScene>
            </div>
          </>
        )}
        <nav className="footer-links" aria-label={t("footer.nav_aria")}>
          <Link href="/about">{t("footer.about_us")}</Link>
          <MissionDialog />
          <Link href="/terms">{t("footer.terms")}</Link>
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/cookies">{t("footer.cookies")}</Link>
        </nav>
        <div className="footer-bottom">
          <span>{copyright ?? <>© {new Date().getFullYear()} Jobbod AI</>}</span>
          <span>{t("footer.tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
