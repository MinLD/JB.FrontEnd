"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/providers/i18n-provider";

export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { href: localize } = useI18n();
  return <Link {...props} href={typeof href === "string" ? localize(href) : href} />;
}
