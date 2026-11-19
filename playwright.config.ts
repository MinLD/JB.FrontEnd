import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3005", trace: "off" },
  webServer: [
    {
      command: "node e2e/mock-backend.mjs",
      url: "http://127.0.0.1:4319/__stats",
      reuseExistingServer: false,
    },
    {
      command: "node .next/standalone/server.js",
      url: "http://127.0.0.1:3005",
      env: {
        PORT: "3005",
        HOSTNAME: "127.0.0.1",
        JOBBOD_API_URL: "http://127.0.0.1:4319",
      },
      reuseExistingServer: false,
      timeout: 60000,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
