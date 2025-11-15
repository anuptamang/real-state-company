<script setup lang="ts">
import type { Page } from "#shared/types";
import PageBuilder from "~/components/PageBuilder.vue";
import ContentSkeleton from "~/components/ContentSkeleton.vue";
import { usePageData } from "~/composables/usePageData";

// Fetch page data from Strapi (with fallback to mock data)
// Automatically finds page by slug "testimonials" based on route name
const route = useRoute();
const { fetchPageByRoute } = usePageData();
const page = await useAsyncData<Page | null>(
  `page-${route.path}`,
  () => fetchPageByRoute()
);

useHead({
  title: page.data.value?.metaTitle || page.data.value?.title || "Testimonials",
  meta: [
    {
      name: "description",
      content:
        page.data.value?.metaDescription ||
        "Read what our clients say about us",
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
