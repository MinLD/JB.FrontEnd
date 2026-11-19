import { clientApi, notifySessionExpired } from "@/services/client-api";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { AuthUser } from "@/types/auth";
export { onSessionExpired } from "@/services/client-api";
let currentUserRequest: ReturnType<typeof clientApi<AuthUser>> | undefined;
let currentUserController: AbortController | undefined;

function invalidateCurrentUserRequest() {
  currentUserController?.abort();
  currentUserController = undefined;
  currentUserRequest = undefined;
}

export async function login(email: string, password: string, remember: boolean) {
  const result = await clientApi<null>(API_ENDPOINTS.auth.login, { method: "POST", body: { email, password, rememberMe: remember } });
  if (result.success) invalidateCurrentUserRequest();
  return result;
}
export function register(full_name: string, email: string, password: string) {
  return clientApi<AuthUser>(API_ENDPOINTS.auth.register, { method: "POST", body: { email, password, full_name } });
}
export function getCurrentUser() {
  if (!currentUserRequest) {
    currentUserController = new AbortController();
    const request = clientApi<AuthUser>(API_ENDPOINTS.auth.me, { signal: currentUserController.signal }).finally(() => {
      if (currentUserRequest === request) {
        currentUserRequest = undefined;
        currentUserController = undefined;
      }
    });
    currentUserRequest = request;
  }
  return currentUserRequest;
}
export function refreshSession() {
  return clientApi<null>(API_ENDPOINTS.auth.refresh, { method: "POST" });
}
export async function logout() {
  const result = await clientApi<null>(API_ENDPOINTS.auth.logout, { method: "POST" });
  if (result.success) {
    invalidateCurrentUserRequest();
    notifySessionExpired();
  }
  return result;
}
