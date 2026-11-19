import { getResponseMessage, isApiEnvelope } from "@/lib/api-envelope";
import { ApiError, apiFailure, apiSuccess } from "@/services/api-response";
import type { ApiOptions, ApiResult } from "@/types/api";

/** Shared transport. Environment adapters choose the URL and cookie policy. */
export async function apiRequest<T>(
  url: string,
  options: ApiOptions = {},
  rethrowFrameworkError?: (error: unknown) => void,
): Promise<ApiResult<T>> {
  const { body, ...init } = options;
  if (body !== undefined && ["GET", "HEAD"].includes(options.method?.toUpperCase() ?? "GET"))
    return apiFailure(new ApiError("GET/HEAD không nhận body JSON.", 400, "INVALID_REQUEST"));
  let headers: Headers;
  let payload: string | undefined;
  try {
    headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
      payload = JSON.stringify(body);
    }
  } catch {
    return apiFailure(new ApiError("Dữ liệu yêu cầu không hợp lệ.", 400, "INVALID_REQUEST"));
  }
  try {
    const response = await fetch(url, {
      ...init,
      headers,
      body: payload,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)])
        : AbortSignal.timeout(15000),
    });
    if (response.ok && (response.status === 204 || response.status === 205 || options.method?.toUpperCase() === "HEAD"))
      return apiSuccess(null as T, response.status);
    let value: unknown;
    try { value = await response.json(); }
    catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      value = null;
    }
    if (!response.ok) {
      const code = isApiEnvelope(value) ? value.code : "REQUEST_FAILED";
      return apiFailure(new ApiError(getResponseMessage(value, `Yêu cầu thất bại (${response.status}).`), response.status, code));
    }
    if (!isApiEnvelope(value)) return apiFailure(new ApiError("Phản hồi không đúng định dạng.", 502, "INVALID_RESPONSE"));
    return apiSuccess(value.data as T, response.status, value.message, value.code);
  } catch (error) {
    // Next.js redirects/prerender interruptions must retain framework semantics.
    rethrowFrameworkError?.(error);
    if (options.signal?.aborted) return apiFailure(new ApiError("Yêu cầu đã được hủy.", 499, "REQUEST_ABORTED"));
    if (error instanceof Error && error.name === "TimeoutError") return apiFailure(new ApiError("Máy chủ phản hồi quá lâu. Vui lòng thử lại.", 504, "REQUEST_TIMEOUT"));
    return apiFailure(new ApiError("Không kết nối được máy chủ. Vui lòng thử lại.", 503, "NETWORK_ERROR"));
  }
}

/** All public callers use backend paths, e.g. /api/profile/me. */
export function isApiPath(path: string) {
  const pathname = path.split("?")[0];
  return !path.includes("#") && pathname.startsWith("/api/") &&
    pathname.slice(5).split("/").every(segment => /^[a-zA-Z0-9_-]+$/.test(segment));
}
