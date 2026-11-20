import { connection } from "next/server";
import { measurementId } from "@/config/measurement";
import { apiRoute } from "@/services/route-response";

export const GET = apiRoute(async () => {
  await connection();
  return { measurementId: measurementId(process.env.JOBBOD_GA_MEASUREMENT_ID) };
});
