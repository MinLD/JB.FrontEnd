import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/services/api-request.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message: "Dùng clientApi, serverApi hoặc serverActionApi; HTTP transport chỉ đặt tại services/api-request.ts.",
        },
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.property.name='fetch']",
          message: "Dùng API adapter chung thay vì gọi fetch trực tiếp.",
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/providers/**/*.{ts,tsx}"],
    ignores: ["src/app/api/auth/**"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: [
          { name: "@/services/api-request", message: "Transport nội bộ; dùng clientApi/serverApi/serverActionApi hoặc apiRoute." },
          { name: "@/services/backend-api", message: "Transport nội bộ; dùng serverApi/serverActionApi hoặc apiRoute." },
        ],
      }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
