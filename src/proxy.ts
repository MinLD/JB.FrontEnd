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
const authRoutes = ["/login", "/register", "/forgot-password"];
export async function proxy(request: NextRequest) {
  const session = getAuthCookies(request);
  const authPage = authRoutes.includes(request.nextUrl.pathname);
  const loginRedirect = () =>
    NextResponse.redirect(new URL("/login", request.url));
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
      response = NextResponse.redirect(new URL("/user", request.url));
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
export const config = {
  matcher: ["/user/:path*", "/login", "/register", "/forgot-password"],
};
