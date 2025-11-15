<script setup lang="ts">
import type { Page } from "#shared/types";
import PageBuilder from "~/components/PageBuilder.vue";
import ContentSkeleton from "~/components/ContentSkeleton.vue";
import { usePageData } from "~/composables/usePageData";

const route = useRoute();
const { fetchPageByRoute } = usePageData();
const page = await useAsyncData<Page | null>(
  `page-${route.path}`,
  () => fetchPageByRoute()
);

// Set SEO meta tags
useHead({
  title: page.data.value?.metaTitle || page.data.value?.title || "About",
  meta: [
    {
      name: "description",
      content:
        page.data.value?.metaDescription ||
        "Learn about our real estate company and team",
    },
  ],
});
</script>

<template>
  <div>
    <PageBuilder
      v-if="page.data.value?.blocks && page.data.value.blocks.length > 0"
      :blocks="page.data.value.blocks"
    />
    <ContentSkeleton v-else />
  </div>
</template>
