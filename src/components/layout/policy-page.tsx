import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { POLICIES, type PolicyKind } from "@/config/policies";

export function PolicyPage({ kind }: { kind: PolicyKind }) {
  const policy = POLICIES[kind];
  return <div className="policy-page">
    <SiteHeader />
    <main>
      <header className="policy-heading">
        <p className="eyebrow">JOBBOD · THÔNG TIN VÀ CHÍNH SÁCH</p>
        <h1>{policy.title}</h1>
        <p className="policy-updated">Cập nhật ngày 19 tháng 11 năm 2026</p>
        <p>{policy.introduction}</p>
      </header>
      <div className="policy-body">
        {policy.sections.map((section, index) => <section key={section.title}><span className="policy-number">0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></section>)}
        <Link href="/" className="policy-back"><ArrowLeft size={16} /> Về trang chủ</Link>
      </div>
    </main>
    <SiteFooter compact />
  </div>;
}
