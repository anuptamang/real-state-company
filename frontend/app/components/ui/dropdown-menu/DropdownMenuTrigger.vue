<script setup lang="ts">
import { inject, onMounted, onUnmounted } from "vue";

const dropdownMenu = inject<{
  isOpen: { value: boolean };
  toggle: () => void;
  trigger: { value: HTMLElement | null };
}>("dropdown-menu");

const triggerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (dropdownMenu && triggerRef.value) {
    dropdownMenu.trigger.value = triggerRef.value;
  }
});

const handleClick = () => {
  dropdownMenu?.toggle();
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownMenu?.isOpen.value &&
    triggerRef.value &&
    !triggerRef.value.contains(event.target as Node) &&
    !(event.target as HTMLElement)?.closest(".dropdown-menu-content")
  ) {
    dropdownMenu.close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="triggerRef" @click="handleClick">
    <slot />
  </div>
</template>
