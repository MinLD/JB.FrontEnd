import { apiRoute } from "@/services/route-response";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { AuthUser } from "@/types/auth";

export const GET = apiRoute(({ api }) => api<AuthUser>(API_ENDPOINTS.auth.me));
