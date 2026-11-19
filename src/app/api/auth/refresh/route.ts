import { ApiError } from "@/services/api-response";
import { refreshBackendSession } from "@/services/auth-refresh";
import { apiRoute } from "@/services/route-response";

export const POST = apiRoute(async ({ session, setSession }) => {
  if (!session.refreshToken) throw new ApiError("Vui lòng đăng nhập để tiếp tục.", 401, "UNAUTHENTICATED");
  setSession(await refreshBackendSession(session.refreshToken));
  return null;
}, { clearSessionOnUnauthorized: true });
