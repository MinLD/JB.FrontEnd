import "server-only";
import { cacheLife } from "next/cache";

export async function Copyright() {
  "use cache";
  cacheLife("days");
  return <>© {new Date().getFullYear()} Jobbod AI</>;
}
