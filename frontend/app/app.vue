<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

/* Layout Transitions */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s ease-in-out;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
