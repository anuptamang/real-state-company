<script setup lang="ts">
import { cn } from "~/utils";
</script>

<template>
  <div :class="cn('px-2 py-1.5 text-sm font-semibold', $attrs.class)">
    <slot />
  </div>
</template>
