import { z } from "zod";
import { backendRequest } from "@/services/backend-api";
import { validateTokenPair } from "@/services/auth-refresh";
import { apiRoute } from "@/services/route-response";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { loginSchema } from "@/lib/validations/auth";
import type { TokenPair } from "@/types/auth";

export const POST = apiRoute(async ({ input, setSession }) => {
  const { rememberMe, ...credentials } = input;
  const tokens = validateTokenPair(await backendRequest<TokenPair>(API_ENDPOINTS.auth.login, { method: "POST", body: credentials }));
  setSession(tokens, rememberMe);
  return null;
}, { schema: loginSchema.extend({ rememberMe: z.boolean().optional().default(false) }) });
