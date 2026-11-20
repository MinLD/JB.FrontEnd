import { pageMetadata } from "@/i18n/server";
import { UserScreen } from "@/components/auth/user-screen";
import { Suspense } from "react";
import { connection } from "next/server";


export default function Page() {
  return <Suspense fallback={null}><AccountContent /></Suspense>;
}

async function AccountContent() {
  await connection();
  return <UserScreen />;
}

export function generateMetadata() { return pageMetadata("user"); }
