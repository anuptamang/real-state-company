// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-07",

  devtools: { enabled: true },

  modules: [
    "shadcn-nuxt",
    "@nuxt/test-utils/module", // Optional: adds Vitest to DevTools
  ],

  typescript: {
    strict: true,
    typeCheck: false, // Disable typeCheck in dev (use 'nuxt typecheck' command instead)
  },

  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },

  // No alias needed - Nuxt automatically provides #shared alias for shared/ directory
  // See: https://nuxt.com/docs/4.x/guide/directory-structure/shared

  runtimeConfig: {
    public: {
      // Data source: 'cms' to use Strapi, 'mock' to use mock data, 'auto' to auto-detect
      dataSource: process.env.NUXT_PUBLIC_DATA_SOURCE || "auto",
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
      strapiApiToken: process.env.NUXT_PUBLIC_STRAPI_API_TOKEN || "",
      cloudflareAccountId: process.env.NUXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || "",
      cloudflareImagesToken:
        process.env.NUXT_PUBLIC_CLOUDFLARE_IMAGES_TOKEN || "",
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    },
  },

  app: {
    /**
     * Page transitions configuration
     * @see https://nuxt.com/docs/4.x/getting-started/transitions
     */
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    /**
     * Layout transitions configuration
     * @see https://nuxt.com/docs/4.x/getting-started/transitions
     */
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
  },
});
