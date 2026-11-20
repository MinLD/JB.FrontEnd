"use client";

import Image from "next/image";
import { DesignAsset } from "@/components/ui/design-asset";
import { useI18n } from "@/providers/i18n-provider";

export function Partners() {
  const { t } = useI18n();

  const organizations = [
    { name: "NTTU", description: t("partners.org_nttu"), src: "/jobbod/partners/nttu.svg", width: 376, height: 90 },
    { name: "NJEC", description: t("partners.org_njec"), src: "/jobbod/partners/njec.png", width: 1182, height: 886 },
    { name: "NIIC", description: t("partners.org_niic"), src: "/jobbod/partners/niic.png", width: 2048, height: 991 },
  ];

  return <section className="partners-section" aria-labelledby="partners-heading">
    <div className="page-container">
      <div className="section-heading"><p className="eyebrow">{t("partners.eyebrow")}</p><h2 id="partners-heading">{t("partners.heading")}</h2><p>{t("partners.description")}</p></div>
      <ul className="partner-organizations" aria-label={t("partners.organizations_aria")}>
        {organizations.map(organization => <li key={organization.name}>
          <div className={`organization-logo organization-${organization.name.toLowerCase()}`}><Image src={organization.src} alt={organization.name} width={organization.width} height={organization.height} sizes="(max-width: 650px) 28vw, 250px" /></div>
          <p>{organization.description}</p>
        </li>)}
      </ul>
      <h2 className="matching-heading">{t("partners.matching_heading")}</h2>
      <div className="matching-grid">
        <div><DesignAsset name="matchGoal" /><h3>{t("partners.match_goal_title")}</h3><p>{t("partners.match_goal_desc")}</p></div>
        <div><DesignAsset name="matchSkills" /><h3>{t("partners.match_skills_title")}</h3><p>{t("partners.match_skills_desc")}</p></div>
        <div><DesignAsset name="matchSchedule" /><h3>{t("partners.match_schedule_title")}</h3><p>{t("partners.match_schedule_desc")}</p></div>
      </div>
    </div>
  </section>;
}
