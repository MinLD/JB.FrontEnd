import { pageMetadata } from "@/i18n/server";
import { PolicyPage } from "@/components/layout/policy-page";
export default function Page() { return <PolicyPage kind="cookies" />; }

export function generateMetadata() { return pageMetadata("cookies"); }
