import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { unstable_rethrow } from "next/navigation";
import type { ZodType } from "zod";
import { ApiError, apiSuccess, apiFailure } from "@/services/api-response";
import { clearAuthCookies, getAuthCookies, setAuthCookies, type SessionCookies } from "@/services/auth-cookie";
import { requestWithSession, SessionError } from "@/services/server-api";
import type { TokenPair } from "@/types/auth";
import type { ApiOptions, ApiResult } from "@/types/api";

type Params = Record<string, string | string[]>;
type RouteContext<Input, RouteParams> = {
  request: NextRequest;
  input: Input;
  session: SessionCookies;
  params: Promise<RouteParams>;
  json: () => Promise<unknown>;
  api: <T>(path: string, options?: ApiOptions) => Promise<T>;
  setSession: (tokens: TokenPair, remember?: boolean) => void;
};
type RouteOptions<Input> = {
  schema?: ZodType<Input>;
  status?: number;
  clearSessionOnUnauthorized?: boolean;
  clearSessionOnSuccess?: boolean;
  acceptUnauthorized?: boolean;
};

/** One boundary for validation, exceptions, result formatting and cookie updates. */
export function apiRoute<Input = undefined, Data = unknown, RouteParams extends Params = Params>(
  handler: (context: RouteContext<Input, RouteParams>) => Promise<Data>,
  options: RouteOptions<Input> = {},
) {
  return async (request: NextRequest, routeContext: { params: Promise<RouteParams> }) => {
    const session = getAuthCookies(request);
    let rotated: TokenPair | undefined;
    let remember = session.remember;
    let clear = false;
    let result: ApiResult<Data | null>;
    try {
      if (!["GET", "HEAD"].includes(request.method)) checkRequestOrigin(request);
      let input = undefined as Input;
      if (options.schema) {
        const parsed = options.schema.safeParse(await readJson(request));
        if (!parsed.success) throw new ApiError(parsed.error.issues[0].message, 422, "VALIDATION_ERROR");
        input = parsed.data;
      }
      const data = await handler({
        request, input, session,
        json: () => readJson(request, true),
        params: routeContext.params,
        setSession(tokens, persist = session.remember) { rotated = tokens; remember = persist; },
        async api<T>(path: string, init: ApiOptions = {}) {
          const response = await requestWithSession<T>(path, session, init);
          if (response.rotated) {
            rotated = response.rotated;
            session.accessToken = rotated.access_token;
            session.refreshToken = rotated.refresh_token;
          }
          return response.data;
        },
      });
      result = apiSuccess(data, options.status);
    } catch (error) {
      unstable_rethrow(error);
      result = options.acceptUnauthorized && error instanceof ApiError && error.status === 401
        ? apiSuccess(null, options.status) : apiFailure(error);
      if (!result.success && result.status === 401 && (error instanceof SessionError || options.clearSessionOnUnauthorized)) clear = true;
      if (error instanceof SessionError && error.rotated) rotated = error.rotated;
    }
    if (result.success && options.clearSessionOnSuccess) clear = true;
    const response = NextResponse.json(result, { status: result.status, headers: { "Cache-Control": "no-store" } });
    if (clear) clearAuthCookies(response);
    else if (rotated) setAuthCookies(response, rotated, remember);
    return response;
  };
}

function checkRequestOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || request.nextUrl.protocol.replace(":", "");
  if ((origin && origin !== `${protocol}://${host}`) || request.headers.get("sec-fetch-site") === "cross-site")
    throw new ApiError("Nguồn yêu cầu không hợp lệ.", 403, "INVALID_ORIGIN");
}

async function readJson(request: NextRequest, allowEmpty = false) {
  try {
    const text = await request.text();
    return allowEmpty && !text ? undefined : JSON.parse(text);
  }
  catch { throw new ApiError("Dữ liệu JSON không hợp lệ.", 400, "INVALID_JSON"); }
}
