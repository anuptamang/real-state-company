<script setup lang="ts">
import type { Block } from "#shared/types";
import BlockHero from "~/components/blocks/BlockHero.vue";
import BlockFeatures from "~/components/blocks/BlockFeatures.vue";
import BlockCta from "~/components/blocks/BlockCta.vue";
import BlockContent from "~/components/blocks/BlockContent.vue";
import BlockPropertiesList from "~/components/blocks/BlockPropertiesList.vue";
import BlockContactForm from "~/components/blocks/BlockContactForm.vue";
import BlockGoogleMap from "~/components/blocks/BlockGoogleMap.vue";
import BlockTestimonials from "~/components/blocks/BlockTestimonials.vue";
import BlockTeam from "~/components/blocks/BlockTeam.vue";

interface Props {
  blocks: Block[];
}

defineProps<Props>();

// Map component names to Vue components
const blockComponents: Record<string, any> = {
  "blocks.hero": BlockHero,
  "blocks.features": BlockFeatures,
  "blocks.cta": BlockCta,
  "blocks.content": BlockContent,
  "blocks.properties-list": BlockPropertiesList,
  "blocks.contact-form": BlockContactForm,
  "blocks.google-map": BlockGoogleMap,
  "blocks.testimonials": BlockTestimonials,
  "blocks.team": BlockTeam,
};

// Get component for a block
const getBlockComponent = (block: Block) => {
  return blockComponents[block.__component] || null;
};
</script>

<template>
  <div class="w-full">
    <component
      v-for="(block, index) in blocks"
      :key="block.id || index"
      :is="getBlockComponent(block)"
      v-bind="block"
    />
  </div>
</template>
