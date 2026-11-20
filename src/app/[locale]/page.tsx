import { getLandingFaq } from "@/config/landing";
import { getStoryLettering } from "@/config/story-lettering";
import { getLocale, pageMetadata } from "@/i18n/server";
import { Copyright } from "@/components/layout/copyright";
import { LandingContent } from "@/components/landing/landing-content";

export default async function HomePage() {
  const locale = await getLocale();
  return <LandingContent faqItems={getLandingFaq(locale)} lettering={getStoryLettering(locale)} copyright={<Copyright />} />;
}

export function generateMetadata() { return pageMetadata("home", "/"); }
