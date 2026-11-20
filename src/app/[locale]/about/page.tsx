import { getTeamGroups } from "@/config/landing";
import { getLocale, pageMetadata } from "@/i18n/server";
import { Copyright } from "@/components/layout/copyright";
import { AboutContent } from "./about-content";


export default async function Page() {
  return <AboutContent groups={getTeamGroups(await getLocale())} copyright={<Copyright />} />;
}

export function generateMetadata() { return pageMetadata("about", "/about"); }
