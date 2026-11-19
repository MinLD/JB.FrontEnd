import "server-only";
import { callServerApi } from "@/services/server-api";
import type { ApiOptions, ApiResult } from "@/types/api";

/** Call inside an explicit "use server" action with a fixed, authorized endpoint.
 * This helper is not itself a remotely callable generic Server Action.
 */
export function serverActionApi<T>(path: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
  return callServerApi<T>(path, options, true);
}
