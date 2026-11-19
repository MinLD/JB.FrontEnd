import "server-only";
import type { NextRequest, NextResponse } from "next/server";
import type { TokenPair } from "@/types/auth";
import { getJwtExpiration } from "@/services/auth-token";
export const AUTH_COOKIE_NAMES = [
  "accessToken",
  "refreshToken",
  "authRemember",
] as const;
export type SessionCookies = {
  accessToken: string | null;
  refreshToken: string | null;
  remember: boolean;
};
type CookieReader = { get: (name: string) => { value: string } | undefined };
export type AuthCookieWriter = Pick<NextResponse["cookies"], "set">;
type CookieTarget = NextResponse | AuthCookieWriter;

export function getAuthCookies(source: Pick<NextRequest, "cookies"> | CookieReader): SessionCookies {
  const reader = "cookies" in source ? source.cookies : source;
  return {
    accessToken: reader.get("accessToken")?.value || null,
    refreshToken: reader.get("refreshToken")?.value || null,
    remember: reader.get("authRemember")?.value === "1",
  };
}
const options = () => ({
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
});
export function setAuthCookies(
  target: CookieTarget,
  tokens: TokenPair,
  remember: boolean,
) {
  const response = { cookies: "cookies" in target ? target.cookies : target };
  const now = Date.now() / 1000;
  const refreshAge = Math.max(
    1,
    Math.floor(
      (getJwtExpiration(tokens.refresh_token) ?? now + 30 * 86400) - now,
    ),
  );
  const accessAge = Math.max(
    1,
    Math.floor(
      (getJwtExpiration(tokens.access_token) ??
        now + (tokens.expires_in ?? 900)) - now,
    ),
  );
  response.cookies.set("accessToken", tokens.access_token, {
    ...options(),
    ...(remember ? { maxAge: accessAge } : {}),
  });
  response.cookies.set("refreshToken", tokens.refresh_token, {
    ...options(),
    ...(remember ? { maxAge: refreshAge } : {}),
  });
  response.cookies.set("authRemember", remember ? "1" : "0", {
    ...options(),
    ...(remember ? { maxAge: refreshAge } : {}),
  });
}
export function clearAuthCookies(target: CookieTarget) {
  const response = { cookies: "cookies" in target ? target.cookies : target };
  for (const name of AUTH_COOKIE_NAMES)
    response.cookies.set(name, "", {
      ...options(),
      expires: new Date(0),
      maxAge: 0,
    });
}
export function mergeAuthCookies(request: NextRequest, tokens: TokenPair) {
  const values = new Map(
    request.cookies.getAll().map(({ name, value }) => [name, value]),
  );
  values.set("accessToken", tokens.access_token);
  values.set("refreshToken", tokens.refresh_token);
  return Array.from(values, ([name, value]) => `${name}=${value}`).join("; ");
}
