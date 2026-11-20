"use client";

import type { TeamGroup } from "@/config/landing";
import type { ReactNode } from "react";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { ArrowDown } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { TeamSection } from "@/components/landing/team-section";
import { MissionDialog } from "@/components/landing/mission-dialog";
import { useI18n } from "@/providers/i18n-provider";

export function AboutContent({ copyright, groups }: { copyright?: ReactNode; groups: TeamGroup[] }) {
  const { t } = useI18n();

  return (
    <div className="about-page">
      <SiteHeader />
      <main>
        <header className="about-hero">
          <p className="eyebrow">{t("about.eyebrow")}</p>
          <h1>
            {t("about.heading_line1")}
            <br />
            <em>{t("about.heading_line2")}</em>
          </h1>
          <p>{t("about.description")}</p>
          <div className="about-actions">
            <Link href="#doi-ngu">
              {t("about.meet_team")} <ArrowDown size={16} />
            </Link>
            <MissionDialog />
          </div>
        </header>
        <TeamSection groups={groups} />
      </main>
      <SiteFooter compact copyright={copyright} />
    </div>
  );
}
