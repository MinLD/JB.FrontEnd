import { ApiError } from "@/services/api-response";
import { apiRoute } from "@/services/route-response";

const forward = apiRoute<undefined, unknown, { path: string[] }>(async ({ request, params, api, json }) => {
  const { path } = await params;
  if (path[0] === "auth" || path.some(part => !/^[a-zA-Z0-9_-]+$/.test(part)))
    throw new ApiError("API không được hỗ trợ.", 400, "INVALID_API_PATH");
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await json();
  return api(`/api/${path.join("/")}${request.nextUrl.search}`, { method: request.method, body });
});

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
