import { backendRequest } from "@/services/backend-api";
import { apiRoute } from "@/services/route-response";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { registerAccountSchema } from "@/lib/validations/auth";
import type { AuthUser } from "@/types/auth";

export const POST = apiRoute(({ input }) => backendRequest<AuthUser>(API_ENDPOINTS.auth.register, { method: "POST", body: input }), {
  schema: registerAccountSchema,
  status: 201,
});
