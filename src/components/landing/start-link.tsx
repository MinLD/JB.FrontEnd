"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import type { ReactNode } from "react";

export function StartLink({ children, className = "", variant = "primary" }: { children: ReactNode; className?: string; variant?: "primary" | "secondary" }) {
  const { user } = useAuth();
  return <Button asChild variant={variant} className={`start-link ${className}`}><Link href={user ? "/user" : "/register"}>{children}</Link></Button>;
}
