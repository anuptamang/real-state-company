<script setup lang="ts">
import { Button } from "~/components/ui/button";

// Define props based on shared types
interface Props {
  title: string;
  subtitle?: string;
  image?: {
    url: string;
    alt?: string;
  };
  cta?: {
    text: string;
    url: string;
  };
}

defineProps<Props>();
</script>

<template>
  <section
    class="relative w-full min-h-[400px] flex items-center justify-center"
  >
    <div v-if="image" class="absolute inset-0 z-0">
      <img
        :src="image.url"
        :alt="image.alt || title"
        class="w-full h-full object-cover"
      />
      <!-- Overlay for better text readability -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70"
      />
    </div>

    <div class="relative z-10 text-center px-8 py-16 max-w-4xl">
      <h1 class="text-5xl font-bold mb-4 text-white drop-shadow-lg">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="text-2xl mb-8 text-white drop-shadow-md">
        {{ subtitle }}
      </p>

      <NuxtLink v-if="cta" :to="cta.url">
        <Button size="lg" variant="default" class="mt-4">
          {{ cta.text }}
        </Button>
      </NuxtLink>
    </div>
  </section>
</template>
