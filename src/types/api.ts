/** One serializable result for client, SSR, Server Actions and route handlers. */
export type ApiResult<T> = {
  success: true;
  status: number;
  code: string;
  message: string;
  data: T;
} | {
  success: false;
  status: number;
  code: string;
  message: string;
  data: null;
};

/** Pass plain JSON as body; serialization is handled centrally. */
export type ApiOptions = Omit<RequestInit, "body" | "credentials" | "cache"> & {
  body?: unknown;
};

/** The upstream Jobbod contract, distinct from the frontend result. */
export type ApiEnvelope<T> = { code: string; message: string; data: T | null };
