import { backendRequest } from "@/services/backend-api";
import { apiRoute } from "@/services/route-response";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export const POST = apiRoute(async ({ session }) => {
  if (session.refreshToken) await backendRequest(API_ENDPOINTS.auth.logout, { method: "POST", body: { refresh_token: session.refreshToken } });
  return null;
}, { acceptUnauthorized: true, clearSessionOnSuccess: true });
