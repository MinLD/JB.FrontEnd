import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { DesignAsset } from "@/components/ui/design-asset";
import { PhotoScene, BobSection } from "@/components/landing/animated-scenes";
import { StartLink } from "@/components/landing/start-link";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Partners } from "@/components/landing/partners";
import { Faq } from "@/components/landing/faq";
import { SiteFooter } from "@/components/landing/site-footer";
import { LandingMotion } from "@/components/landing/landing-motion";
import { BackToTop } from "@/components/landing/back-to-top";
import { StoryVideo } from "@/components/landing/story-video";
import { frostedBackgroundStyle } from "@/config/design-assets";

export default function HomePage() {
  return <div className="landing-viewport"><div className="landing-canvas">
    <a className="skip-link" href="#main-content">Đến nội dung chính</a>
    <main id="main-content" className="landing-main">
      <section id="gioi-thieu" className="hero frosted-background" style={frostedBackgroundStyle} aria-labelledby="hero-heading" tabIndex={-1}>
        <SiteHeader />
        <div className="hero-container">
          <h1 id="hero-heading">Tìm đúng <em>đồng đội</em><br />Cùng xây dựng <em>dự án thật.</em></h1>
          <div className="hero-description"><p>Jobbod giúp sinh viên tìm đồng đội cùng mục tiêu, bổ trợ kỹ năng và phù hợp lịch rảnh — để bắt đầu hackathon, cuộc thi và những dự án thật.</p><Link href="#lam-quen-voi-bob" className="hero-bob-link">Trò chuyện với Bob</Link></div>
        </div>
        <div className="hero-preview">
          <StoryVideo />
        </div>
      </section>
      <section className="connection-section" aria-labelledby="connection-heading"><div className="page-container connection-grid">
        <PhotoScene />
        <div className="connection-copy"><p className="eyebrow with-line">CÓ NGƯỜI CÙNG MÌNH</p><h2 id="connection-heading">Ý tưởng lớn,<br />bắt đầu từ<br /><em>một kết nối.</em></h2><p>Từ một người bạn cùng học đến đồng đội cho lần hackathon đầu tiên. Jobbod giúp bạn tìm người để bắt đầu.</p><Link className="text-link" href="#cach-hoat-dong">Tìm người cùng làm <DesignAsset name="photoArrow" /></Link></div>
      </div></section>
      <BobSection />
      <HowItWorks />
      <section className="project-section page-container" aria-labelledby="project-heading"><div className="project-card"><div className="project-photo"><DesignAsset name="projectPhoto" alt="Nhóm sinh viên NTTU cùng dự án tại cuộc thi khởi nghiệp" sizes="(max-width: 700px) 100vw, 615px" /></div><div className="project-copy"><p className="eyebrow">TÌM THẤY NHAU. CÙNG BẮT ĐẦU.</p><h2 id="project-heading">Dự án đầu tiên<br />của <em>cả nhóm.</em></h2><p>Ý tưởng của bạn có thể đang chờ một người có thế mạnh khác mình.</p><StartLink>Bắt đầu cùng Bob <DesignAsset name="projectArrow" /></StartLink></div></div></section>
      <Partners />
      <section className="faq-section" id="faq" aria-labelledby="faq-heading"><div className="faq-container"><div className="faq-intro"><p className="eyebrow">CÂU HỎI THƯỜNG GẶP</p><h2 id="faq-heading">Thêm một chút<br />về <em>JobBod.</em></h2><p>Những điều bạn muốn biết trước khi bắt đầu.</p><Link href="/about">Gặp gỡ đội ngũ <ArrowUpRight size={16} aria-hidden="true" /></Link></div><Faq /></div></section>
    </main>
    <SiteFooter />
    <BackToTop />
    <LandingMotion />
  </div></div>;
}
