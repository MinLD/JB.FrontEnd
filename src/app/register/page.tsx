import { AuthScreen } from "@/components/auth/auth-screen";
import { Copyright } from "@/components/layout/copyright";
export const metadata = { title: "Đăng ký" };
export default function Page() {
  return <AuthScreen mode="register" copyright={<Copyright />} />;
}
