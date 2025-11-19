<script setup lang="ts">
import { inject, computed } from "vue";
import { cn } from "~/utils";

const dropdownMenu = inject<{
  isOpen: { value: boolean };
  close: () => void;
}>("dropdown-menu");

const isVisible = computed(() => dropdownMenu?.isOpen.value ?? false);
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-[-10px]"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-[-10px]"
  >
    <div
      v-if="isVisible"
      class="dropdown-menu-content absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-50"
    >
      <slot />
    </div>
  </Transition>
</template>
