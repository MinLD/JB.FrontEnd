"use client";

import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { ArrowLeft } from "lucide-react";
import type { PolicyDocument } from "@/config/policies";
import { useI18n } from "@/providers/i18n-provider";

export function PolicyBody({ policy }: { policy: PolicyDocument }) {
  const { t } = useI18n();

  return (
    <main>
      <header className="policy-heading">
        <p className="eyebrow">{t("common.policy_eyebrow")}</p>
        <h1>{policy.title}</h1>
        <p className="policy-updated">{t("common.policy_updated")}</p>
        <p>{policy.introduction}</p>
      </header>
      <div className="policy-body">
        {policy.sections.map((section, index) => (
          <section key={section.title}>
            <span className="policy-number">0{index + 1}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
        <Link href="/" className="policy-back">
          <ArrowLeft size={16} /> {t("common.back_to_home")}
        </Link>
      </div>
    </main>
  );
}
