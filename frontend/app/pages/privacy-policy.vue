<script setup lang="ts">
import type { Page } from "#shared/types";
import PageBuilder from "~/components/PageBuilder.vue";
import ContentSkeleton from "~/components/ContentSkeleton.vue";
import { usePageData } from "~/composables/usePageData";

// Fetch page data from Strapi (with fallback to mock data)
// Automatically finds page by slug "privacy-policy" based on route name
const route = useRoute();
const { fetchPageByRoute } = usePageData();
const page = await useAsyncData<Page | null>(
  `page-${route.path}`,
  () => fetchPageByRoute()
);

// Set SEO meta tags
useHead({
  title: page.data.value?.metaTitle || page.data.value?.title || "Privacy Policy",
  meta: [
    {
      name: "description",
      content:
        page.data.value?.metaDescription ||
        "Our privacy policy and how we handle your personal information",
    },
  ],
});
</script>

<template>
  <div>
    <PageBuilder
      v-if="page.data.value?.blocks"
      :blocks="page.data.value.blocks"
    />
    <ContentSkeleton v-else />
  </div>
</template>
