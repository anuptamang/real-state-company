<script setup lang="ts">
import type { GlobalOptions } from "#shared/types";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import { useStrapi } from "~/composables/useStrapi";

// Fetch global options from Strapi (with fallback to mock data)
const { fetchGlobalOptions } = useStrapi();
const { data: globalOptions, refresh } =
  await useAsyncData<GlobalOptions | null>(
    "global-options",
    async () => {
      const data = await fetchGlobalOptions();
      return data;
    },
    {
      server: false, // Only fetch on client to avoid serialization issues
      lazy: true, // Don't block rendering
      default: () => null,
    }
  );

// Refresh global options periodically to get latest changes from Strapi
// This ensures changes in Strapi are reflected on the frontend
if (import.meta.client) {
  // Refresh every 30 seconds to get latest data
  setInterval(() => {
    refresh();
  }, 30000);

  // Debug: Log global options to console
  watch(
    globalOptions,
    (newVal) => {
      if (newVal) {
        // console.log("Global Options:", newVal);
        // console.log("Header:", newVal.header);
        // console.log("Footer:", newVal.footer);
      }
    },
    { immediate: true }
  );
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header
      v-if="globalOptions?.header"
      :logo="globalOptions.header.logo"
      :logo-text="globalOptions.header.logoText"
      :menu="globalOptions.header.menu"
      :links="globalOptions.header.links || []"
    />

    <main class="flex-1">
      <slot />
    </main>

    <Footer
      v-if="globalOptions?.footer"
      :links="globalOptions.footer.links"
      :social-media="globalOptions.footer.socialMedia"
      :menu="globalOptions.footer.menu"
      :site-url="globalOptions?.site?.siteUrl"
      :site-name="globalOptions?.site?.siteName"
    />
  </div>
</template>
