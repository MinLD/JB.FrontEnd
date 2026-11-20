import { pageMetadata } from "@/i18n/server";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Copyright } from "@/components/layout/copyright";
export default function Page() {
  return <AuthScreen mode="register" copyright={<Copyright />} />;
}

export function generateMetadata() { return pageMetadata("register", "/register"); }
