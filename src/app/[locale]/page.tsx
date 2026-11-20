import { getLandingFaq } from "@/config/landing";
import { getStoryLettering } from "@/config/story-lettering";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";
import { SiteStructuredData } from "@/components/layout/site-structured-data";
import { Copyright } from "@/components/layout/copyright";
import { LandingContent } from "@/components/landing/landing-content";

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  return <><SiteStructuredData locale={locale} dictionary={dictionary} /><LandingContent faqItems={getLandingFaq(locale)} lettering={getStoryLettering(locale)} copyright={<Copyright />} /></>;
}

export function generateMetadata() { return pageMetadata("home"); }
