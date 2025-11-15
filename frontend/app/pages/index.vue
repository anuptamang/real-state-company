<script setup lang="ts">
import type { Page } from "#shared/types";
import PageBuilder from "~/components/PageBuilder.vue";
import ContentSkeleton from "~/components/ContentSkeleton.vue";
import { usePageData } from "~/composables/usePageData";

const route = useRoute();
const { fetchPageByRoute } = usePageData();

const page = await useAsyncData<Page | null>(
  `page-${route.path}`,
  () => fetchPageByRoute(),
  {
    lazy: false,
    default: () => null,
  }
);

// Set SEO meta tags
useHead({
  title: page.data.value?.metaTitle || page.data.value?.title || "Home",
  meta: [
    {
      name: "description",
      content:
        page.data.value?.metaDescription ||
        "Find your dream property with our expert real estate services",
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
