import type { ApiResult } from "@/types/api";

/** Internal exception; callers of clientApi/serverApi/serverActionApi receive ApiResult. */
export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 500, code = "REQUEST_FAILED") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function apiSuccess<T>(data: T, status = 200, message = "Thành công", code = "SUCCESS"): ApiResult<T> {
  return { success: true, status, code, message, data };
}

export function apiFailure(error: unknown): ApiResult<never> {
  return {
    success: false,
    status: error instanceof ApiError ? error.status : 500,
    code: error instanceof ApiError ? error.code : "INTERNAL_ERROR",
    message: error instanceof ApiError ? error.message : "Yêu cầu thất bại. Vui lòng thử lại.",
    data: null,
  };
}
