"use client";

import type { FaqItem } from "@/config/landing";
import type { StoryLettering } from "@/config/story-lettering";
import type { ReactNode } from "react";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
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
import { useI18n } from "@/providers/i18n-provider";

export function LandingContent({ copyright, faqItems, lettering }: { copyright?: ReactNode; faqItems: readonly FaqItem[]; lettering: StoryLettering }) {
  const { t } = useI18n();

  return (
    <div className="landing-viewport">
      <div className="landing-canvas">
        <a className="skip-link" href="#main-content">
          {t("common.skip_to_content")}
        </a>
        <main id="main-content" className="landing-main">
          <section
            id="gioi-thieu"
            className="hero frosted-background"
            style={frostedBackgroundStyle}
            aria-labelledby="hero-heading"
          >
            <SiteHeader />
            <div className="hero-container">
              <h1 id="hero-heading">
                {t("hero.title_line1_pre")}
                <em>{t("hero.title_line1_em")}</em>
                <br />
                {t("hero.title_line2_pre")}
                <em>{t("hero.title_line2_em")}</em>
              </h1>
              <div className="hero-description">
                <p>{t("hero.description")}</p>
                <Link href="#lam-quen-voi-bob" className="hero-bob-link">
                  {t("hero.cta")}
                </Link>
              </div>
            </div>
            <div className="hero-preview">
              <StoryVideo lettering={lettering} />
            </div>
          </section>
          <section
            className="connection-section"
            aria-labelledby="connection-heading"
          >
            <div className="page-container connection-grid">
              <PhotoScene />
              <div className="connection-copy">
                <p className="eyebrow with-line">{t("connection.eyebrow")}</p>
                <h2 id="connection-heading">
                  {t("connection.heading_line1")}
                  <br />
                  {t("connection.heading_line2")}
                  <br />
                  <em>{t("connection.heading_line3")}</em>
                </h2>
                <p>{t("connection.description")}</p>
                <Link className="text-link" href="#cach-hoat-dong">
                  {t("connection.link")} <DesignAsset name="photoArrow" />
                </Link>
              </div>
            </div>
          </section>
          <BobSection />
          <HowItWorks />
          <section
            className="project-section page-container"
            aria-labelledby="project-heading"
          >
            <div className="project-card">
              <div className="project-photo">
                <DesignAsset
                  name="projectPhoto"
                  alt={t("project.photo_alt")}
                  sizes="(max-width: 700px) 100vw, 615px"
                />
              </div>
              <div className="project-copy">
                <p className="eyebrow">{t("project.eyebrow")}</p>
                <h2 id="project-heading">
                  {t("project.heading_line1")}
                  <br />
                  {t("project.heading_line2_pre")}
                  <em>{t("project.heading_line2_em")}</em>
                </h2>
                <p>{t("project.description")}</p>
                <StartLink>
                  {t("project.cta")} <DesignAsset name="projectArrow" />
                </StartLink>
              </div>
            </div>
          </section>
          <Partners />
          <section
            className="faq-section"
            id="faq"
            aria-labelledby="faq-heading"
          >
            <div className="faq-container">
              <div className="faq-intro">
                <p className="eyebrow">{t("faq.eyebrow")}</p>
                <h2 id="faq-heading">
                  {t("faq.heading_line1")}
                  <br />
                  {t("faq.heading_line2_pre")}
                  <em>{t("faq.heading_line2_em")}</em>
                </h2>
                <p>{t("faq.description")}</p>
                <Link href="/about">
                  {t("faq.meet_team")}{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <Faq items={faqItems} />
            </div>
          </section>
        </main>
        <SiteFooter copyright={copyright} />
        <BackToTop />
        <LandingMotion />
      </div>
    </div>
  );
}
