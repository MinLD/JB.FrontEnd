import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { TeamSection } from "@/components/landing/team-section";
import { MissionDialog } from "@/components/landing/mission-dialog";

export const metadata = { title: "Về chúng tôi" };

export default function Page() {
  return <div className="about-page">
    <SiteHeader />
    <main>
      <header className="about-hero">
        <p className="eyebrow">VỀ CHÚNG TÔI</p>
        <h1>Một đội ngũ.<br /><em>Chung một khởi đầu.</em></h1>
        <p>Chúng tôi xây dựng JobBod để sinh viên tìm được người cùng chí hướng, bổ trợ kỹ năng và bắt đầu những dự án có ý nghĩa.</p>
        <div className="about-actions"><Link href="#doi-ngu">Gặp gỡ đội ngũ <ArrowDown size={16} /></Link><MissionDialog /></div>
      </header>
      <TeamSection />
    </main>
    <SiteFooter compact />
  </div>;
}
