import { NextResponse, type NextRequest } from "next/server";
import { refreshBackendSession } from "@/services/auth-refresh";
import { getJwtExpiration, shouldRefreshJwtToken } from "@/services/auth-token";
import {
  clearAuthCookies,
  getAuthCookies,
  mergeAuthCookies,
  setAuthCookies,
} from "@/services/auth-cookie";
import type { TokenPair } from "@/types/auth";
import { apiFailure, ApiError } from "@/services/api-response";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isValidLocale, localePath, parseLocalePath } from "@/i18n/settings";
const authRoutes = ["/login", "/register", "/forgot-password"];
async function sessionProxy(request: NextRequest, pathname: string, redirectPath: (path: string) => string) {
  const session = getAuthCookies(request);
  const authPage = authRoutes.includes(pathname);
  const loginRedirect = () =>
    NextResponse.redirect(new URL(redirectPath("/login"), request.url));
  if (!session.accessToken && !session.refreshToken)
    return authPage ? NextResponse.next() : loginRedirect();
  try {
    // Navigation is an optimistic gate. APIs validate the token and permissions;
    // reading exp only schedules rotation, it does not authenticate the user.
    let rotated: TokenPair | undefined;
    if (!session.accessToken || getJwtExpiration(session.accessToken) === null || shouldRefreshJwtToken(session.accessToken)) {
      if (!session.refreshToken) throw new ApiError("Vui lòng đăng nhập để tiếp tục.", 401, "UNAUTHENTICATED");
      rotated = await refreshBackendSession(session.refreshToken);
    }
    let response: NextResponse;
    if (authPage) {
      response = NextResponse.redirect(new URL(redirectPath("/user"), request.url));
    } else {
      const headers = new Headers(request.headers);
      if (rotated) headers.set("cookie", mergeAuthCookies(request, rotated));
      response = NextResponse.next({ request: { headers } });
    }
    if (rotated) setAuthCookies(response, rotated, session.remember);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const response = authPage ? NextResponse.next() : loginRedirect();
      clearAuthCookies(response);
      return response;
    }
    // Keep the session on upstream outages. Protected pages must not render.
    const response = authPage
      ? NextResponse.next()
      : NextResponse.json(
          apiFailure(new ApiError("Chưa thể xác thực phiên. Vui lòng tải lại trang để thử lại.", 503, "SESSION_UNAVAILABLE")),
          {
            status: 503,
            headers: { "Cache-Control": "no-store", "Retry-After": "5" },
          },
        );
    return response;
  }
}

export async function proxy(request: NextRequest) {
  const parsed = parseLocalePath(request.nextUrl.pathname);
  const saved = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const locale = parsed.locale ?? (isValidLocale(saved) ? saved : DEFAULT_LOCALE);
  const pathname = parsed.pathname;
  const protectedPage = pathname === "/user" || pathname.startsWith("/user/");
  const response = protectedPage || authRoutes.includes(pathname)
    ? await sessionProxy(request, pathname, path => localePath(path, locale))
    : NextResponse.next();
  if (response.status !== 200 || parsed.locale) return response;

  const url = request.nextUrl.clone();
  url.pathname = localePath(pathname, locale);
  const headers = new Headers(response.headers);
  headers.delete("x-middleware-next");
  // Legacy URLs depend on the cookie. Never cache them across languages.
  headers.set("Cache-Control", "private, no-store");
  headers.append("Vary", "Cookie");
  return NextResponse.redirect(url, { status: 307, headers });
}
export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\..*).*)"],
};
