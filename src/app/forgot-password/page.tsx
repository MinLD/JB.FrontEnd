import { AuthScreen } from "@/components/auth/auth-screen";
import { Copyright } from "@/components/layout/copyright";
export const metadata = { title: "Quên mật khẩu" };
export default function Page() {
  return <AuthScreen mode="forgot" copyright={<Copyright />} />;
}
