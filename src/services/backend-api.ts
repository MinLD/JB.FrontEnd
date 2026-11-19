import "server-only";
import { unstable_rethrow } from "next/navigation";
import { apiRequest, isApiPath } from "@/services/api-request";
import { ApiError } from "@/services/api-response";
import type { ApiOptions } from "@/types/api";

function buildBackendApiUrl(path: string) {
  const base = process.env.JOBBOD_API_URL || "https://api.jobbod.net";
  if (!isApiPath(path)) throw new ApiError("Đường dẫn API không hợp lệ.", 400, "INVALID_API_PATH");
  const url = new URL(base);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new ApiError("Cấu hình backend không hợp lệ.", 500, "INVALID_BACKEND_URL");
  return `${base.replace(/\/+$/, "")}${path}`;
}

/** Internal transport for session/auth infrastructure; never imported by UI. */
export async function backendRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const result = await apiRequest<T>(buildBackendApiUrl(path), options, unstable_rethrow);
  if (!result.success) throw new ApiError(result.message, result.status, result.code);
  return result.data;
}
