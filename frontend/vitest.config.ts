import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    env: {
      NUXT_PUBLIC_DATA_SOURCE: "cms",
      NUXT_PUBLIC_STRAPI_URL: "https://test.strapi.com",
      NUXT_PUBLIC_STRAPI_API_TOKEN: "test-token",
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/unit/**/*.{test,spec}.{ts,js}"],
          environment: "node",
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/**/*.{test,spec}.{ts,js}"],
          environment: "nuxt",
          setupFiles: [resolve(__dirname, "test/setup.ts")],
        },
      }),
      {
        test: {
          name: "e2e",
          include: ["test/e2e/**/*.{test,spec}.{ts,js}"],
          environment: "node",
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/**",
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
