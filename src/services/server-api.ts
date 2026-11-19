import "server-only";
import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { backendRequest } from "@/services/backend-api";
import { ApiError, apiSuccess, apiFailure } from "@/services/api-response";
import { isApiPath } from "@/services/api-request";
import { refreshBackendSession } from "@/services/auth-refresh";
import { shouldRefreshJwtToken } from "@/services/auth-token";
import { getAuthCookies, setAuthCookies, clearAuthCookies, type SessionCookies } from "@/services/auth-cookie";
import type { TokenPair } from "@/types/auth";
import type { ApiOptions, ApiResult } from "@/types/api";

/** Internal metadata never appears in ApiResult or a browser response. */
export class SessionError extends ApiError {
  rotated?: TokenPair;
  constructor(error: ApiError, rotated?: TokenPair) {
    super(error.message, error.status, error.code);
    this.rotated = error.status === 401 ? undefined : rotated;
  }
}

/** Shared session engine for proxy, route handlers, SSR and Server Actions. */
export async function requestWithSession<T>(path: string, session: SessionCookies, options: ApiOptions = {}, allowRefresh = true) {
  let access = session.accessToken;
  let rotated: TokenPair | undefined;
  const rotate = async () => {
    if (!session.refreshToken) throw new ApiError("Vui lòng đăng nhập để tiếp tục.", 401, "UNAUTHENTICATED");
    if (!allowRefresh) throw new ApiError("Phiên cần được làm mới qua proxy hoặc Server Action.", 401, "SESSION_REFRESH_REQUIRED");
    rotated = await refreshBackendSession(session.refreshToken);
    access = rotated.access_token;
  };
  const send = () => {
    if (!access) throw new ApiError("Vui lòng đăng nhập để tiếp tục.", 401, "UNAUTHENTICATED");
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${access}`);
    return backendRequest<T>(path, { ...options, headers });
  };
  try {
    if (!access || shouldRefreshJwtToken(access)) await rotate();
    let data: T;
    try { data = await send(); }
    catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || rotated || !session.refreshToken) throw error;
      await rotate();
      data = await send();
    }
    return { data, rotated };
  } catch (error) {
    unstable_rethrow(error);
    throw new SessionError(error instanceof ApiError ? error : new ApiError("Không thể xác thực phiên.", 503), rotated);
  }
}

/** Internal adapter; mutable cookies are enabled only by serverActionApi. */
export async function callServerApi<T>(path: string, options: ApiOptions, mutableCookies: boolean): Promise<ApiResult<T>> {
  if (!isApiPath(path) || path.startsWith("/api/backend/") || (path.startsWith("/api/auth/") && path !== "/api/auth/me"))
    return apiFailure(new ApiError("API không được hỗ trợ tại đây.", 400, "INVALID_API_PATH"));
  if (!mutableCookies && !["GET", "HEAD"].includes(options.method?.toUpperCase() ?? "GET"))
    return apiFailure(new ApiError("SSR chỉ đọc dữ liệu; dùng serverActionApi để thay đổi dữ liệu.", 405, "SSR_READ_ONLY"));
  // Read outside catch so Next.js request/prerender control flow stays intact.
  const store = await cookies();
  const session = getAuthCookies(store);
  try {
    const { data, rotated } = await requestWithSession<T>(path, session, options, mutableCookies);
    if (mutableCookies && rotated) setAuthCookies(store, rotated, session.remember);
    return apiSuccess(data);
  } catch (error) {
    unstable_rethrow(error);
    if (mutableCookies && error instanceof SessionError) {
      if (error.status === 401) clearAuthCookies(store);
      else if (error.rotated) setAuthCookies(store, error.rotated, session.remember);
    }
    return apiFailure(error);
  }
}

/** Server Component / SSR: reads request cookies; refresh belongs to the proxy. */
export function serverApi<T>(path: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
  return callServerApi<T>(path, options, false);
}
