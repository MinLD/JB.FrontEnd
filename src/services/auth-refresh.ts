import "server-only";
import { createHash } from "node:crypto";
import { backendRequest } from "@/services/backend-api";
import { ApiError } from "@/services/api-response";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { TokenPair } from "@/types/auth";
type Entry = { promise: Promise<TokenPair>; expiresAt: number };
// Same pattern as DPRental: share in-flight rotations and briefly reuse the result
// for parallel requests still carrying the previous refresh cookie.
const state = globalThis as typeof globalThis & {
  __jobbodRefreshSessions?: Map<string, Entry>;
};
const sessions = (state.__jobbodRefreshSessions ??= new Map<string, Entry>());
export function validateTokenPair(tokens: TokenPair) {
  if (
    !tokens ||
    typeof tokens.access_token !== "string" ||
    !tokens.access_token ||
    typeof tokens.refresh_token !== "string" ||
    !tokens.refresh_token ||
    (tokens.expires_in !== undefined &&
      (typeof tokens.expires_in !== "number" || !Number.isFinite(tokens.expires_in) || tokens.expires_in <= 0))
  )
    throw new ApiError("Phản hồi xác thực không hợp lệ.", 502, "INVALID_RESPONSE");
  return tokens;
}
export async function refreshBackendSession(
  refreshToken: string,
): Promise<TokenPair> {
  const key = createHash("sha256").update(refreshToken).digest("hex");
  for (const [key, entry] of sessions)
    if (entry.expiresAt < Date.now()) sessions.delete(key);
  const existing = sessions.get(key);
  if (existing) return existing.promise;
  const entry: Entry = {
    promise: backendRequest<TokenPair>(API_ENDPOINTS.auth.refresh, {
      method: "POST",
      body: { refresh_token: refreshToken },
    }).then(validateTokenPair),
    expiresAt: Infinity,
  };
  sessions.set(key, entry);
  try {
    const tokens = await entry.promise;
    entry.expiresAt = Date.now() + 5000;
    if (sessions.size > 256)
      for (const [oldKey, old] of sessions) {
        if (oldKey !== key && old.expiresAt !== Infinity)
          sessions.delete(oldKey);
        if (sessions.size <= 256) break;
      }
    return tokens;
  } catch (error) {
    sessions.delete(key);
    throw error;
  }
}
