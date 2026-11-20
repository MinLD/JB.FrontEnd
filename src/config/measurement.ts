/** Public identifiers only. Missing or invalid configuration leaves measurement off. */
export const MEASUREMENT_CONFIG_PATH = "/api/measurement";
export const ANALYTICS_CHOICE_KEY = "jobbod_analytics_v1";

export function measurementId(value: string | undefined): string | null {
  const id = value?.trim();
  return id && /^G-[A-Z0-9]{6,20}$/.test(id) ? id : null;
}

export function googleVerification(value: string | undefined): string | undefined {
  const token = value?.trim();
  return token && /^[A-Za-z0-9_-]{10,256}$/.test(token) ? token : undefined;
}

export type MeasurementConfig = { measurementId: string | null };
