import type { ApiEnvelope } from "@/types/api";

/** Validate the JSON envelope before reading data from an untrusted response. */
export function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) &&
    "data" in value && "code" in value && typeof value.code === "string" &&
    "message" in value && typeof value.message === "string";
}

export function getResponseMessage(value: unknown, fallback: string): string {
  return typeof value === "object" && value !== null &&
    "message" in value && typeof value.message === "string" && value.message.trim()
    ? value.message : fallback;
}
