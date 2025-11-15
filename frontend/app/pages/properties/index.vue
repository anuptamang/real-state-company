<script setup lang="ts">
import type { Page } from "#shared/types";
import PageBuilder from "~/components/PageBuilder.vue";
import ContentSkeleton from "~/components/ContentSkeleton.vue";
import { useStrapi } from "~/composables/useStrapi";

// Fetch page data from Strapi (with fallback to mock data)
const { fetchPage } = useStrapi();
const page = await useAsyncData<Page | null>("properties-page", () =>
  fetchPage("properties")
);

// Set SEO meta tags
useHead({
  title: page.data.value?.metaTitle || page.data.value?.title || "Properties",
  meta: [
    {
      name: "description",
      content:
        page.data.value?.metaDescription ||
        "Browse our selection of available properties",
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
