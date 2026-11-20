import { SiteHeader } from "./site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { getPolicy, type PolicyKind } from "@/config/policies";
import { Copyright } from "@/components/layout/copyright";
import { getLocale } from "@/i18n/server";
import { PolicyBody } from "./policy-body";

export async function PolicyPage({ kind }: { kind: PolicyKind }) {
  const policy = getPolicy(kind, await getLocale());

  return (
    <div className="policy-page">
      <SiteHeader />
      <PolicyBody policy={policy} />
      <SiteFooter compact copyright={<Copyright />} />
    </div>
  );
}
