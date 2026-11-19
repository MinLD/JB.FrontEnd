import { AuthScreen } from "@/components/auth/auth-screen";
import { Copyright } from "@/components/layout/copyright";
export const metadata = { title: "Đăng nhập" };
export default function Page() {
  return <AuthScreen mode="login" copyright={<Copyright />} />;
}
