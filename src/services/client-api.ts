import "client-only";
import { apiRequest, isApiPath } from "@/services/api-request";
import { ApiError, apiFailure } from "@/services/api-response";
import type { ApiOptions, ApiResult } from "@/types/api";

const listeners = new Set<() => void>();
export function onSessionExpired(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function notifySessionExpired() {
  listeners.forEach(listener => listener());
}

/** Client Component: same-origin Next routes; no token handling at the callsite. */
export async function clientApi<T>(path: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
  if (!isApiPath(path) || path.startsWith("/api/backend/"))
    return apiFailure(new ApiError("Đường dẫn API không hợp lệ.", 400, "INVALID_API_PATH"));
  const url = path.startsWith("/api/auth/") ? path : `/api/backend/${path.slice(5)}`;
  const result = await apiRequest<T>(url, options);
  if (!result.success && result.status === 401) notifySessionExpired();
  return result;
}
