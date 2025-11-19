<script setup lang="ts">
import { inject } from "vue";
import { cn } from "~/utils";

const dropdownMenu = inject<{
  close: () => void;
}>("dropdown-menu");

const handleClick = () => {
  dropdownMenu?.close();
};
</script>

<template>
  <div
    :class="
      cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        $attrs.class
      )
    "
    @click="handleClick"
  >
    <slot />
  </div>
</template>
