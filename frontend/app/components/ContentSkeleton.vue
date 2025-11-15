<script setup lang="ts">
import { Skeleton } from "~/components/ui/skeleton";
</script>

<template>
  <div class="w-full py-16 px-4 bg-background">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Hero Skeleton -->
      <div class="relative w-full h-[500px] rounded-lg overflow-hidden">
        <Skeleton class="w-full h-full" />
      </div>

      <!-- Content Skeleton -->
      <div class="max-w-4xl mx-auto space-y-6">
        <Skeleton class="h-12 w-3/4" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-5/6" />
        <div class="space-y-4 pt-4">
          <Skeleton class="h-8 w-1/2" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-4/5" />
        </div>
        <div class="space-y-4 pt-4">
          <Skeleton class="h-8 w-1/2" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </div>
      </div>

      <!-- Cards Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div v-for="i in 3" :key="i" class="space-y-4">
          <Skeleton class="h-48 w-full rounded-lg" />
          <Skeleton class="h-6 w-3/4" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-5/6" />
        </div>
      </div>
    </div>
  </div>
</template>
