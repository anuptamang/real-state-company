<script setup lang="ts">
import { provide, ref } from "vue";

const isOpen = ref(false);
const trigger = ref<HTMLElement | null>(null);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

provide("dropdown-menu", {
  isOpen,
  open,
  close,
  toggle,
  trigger,
});

defineExpose({
  isOpen,
  open,
  close,
  toggle,
});
</script>

<template>
  <div class="relative">
    <slot />
  </div>
</template>
