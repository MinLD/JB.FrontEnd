"use client";
import { LocalizedLink as Link } from "@/components/layout/localized-link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import type { ReactNode } from "react";
import { trackAnalytics } from "@/lib/analytics";

export function StartLink({ children, className = "", variant = "primary" }: { children: ReactNode; className?: string; variant?: "primary" | "secondary" }) {
  const { user } = useAuth();
  return <Button asChild variant={variant} className={`start-link ${className}`}><Link href={user ? "/user" : "/register"} onClick={() => { if (!user) trackAnalytics("sign_up_click"); }}>{children}</Link></Button>;
}
