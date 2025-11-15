<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getLucideIcon } from "~/utils/lucide-icons";
import type { Component } from "vue";

interface Feature {
  title: string;
  description: string;
  icon?:
    | string
    | {
        url: string;
        alt?: string;
      };
}

interface Props {
  title?: string;
  features: Feature[];
}

const props = defineProps<Props>();

// Check if icon is an uploaded image (object with url)
const isUploadedIcon = (
  icon?: string | { url: string; alt?: string }
): icon is { url: string; alt?: string } => {
  return typeof icon === "object" && icon !== null && "url" in icon;
};

const getIcon = (iconName?: string): Component | null => {
  if (!iconName || typeof iconName !== "string") {
    return null;
  }
  return getLucideIcon(iconName);
};
</script>

<template>
  <section class="w-full py-16 px-4 bg-background">
    <div class="max-w-7xl mx-auto">
      <h2
        v-if="title"
        class="text-4xl font-bold text-center mb-12 text-foreground"
      >
        {{ title }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card v-for="(feature, index) in features" :key="index" class="h-full">
          <CardHeader>
            <div
              v-if="feature.icon"
              class="flex mb-4"
            >
              <div class="rounded-full bg-primary/10 p-3">
                <!-- Uploaded icon (image) -->
                <img
                  v-if="isUploadedIcon(feature.icon)"
                  :src="feature.icon.url"
                  :alt="feature.icon.alt || feature.title"
                  class="h-6 w-6 object-contain"
                />
                <!-- Lucide icon from string -->
                <component
                  v-else-if="typeof feature.icon === 'string' && getIcon(feature.icon)"
                  :is="getIcon(feature.icon)"
                  class="h-6 w-6 text-primary"
                />
                <!-- Lucide icon from object (shared.icon component) -->
                <component
                  v-else-if="typeof feature.icon === 'object' && feature.icon?.name && getIcon(feature.icon.name)"
                  :is="getIcon(feature.icon.name)"
                  class="h-6 w-6 text-primary"
                />
                <!-- Fallback: show icon name if icon not found -->
                <span
                  v-else
                  class="text-xs text-muted-foreground"
                  :title="`Icon not found: ${typeof feature.icon === 'object' ? feature.icon?.name || JSON.stringify(feature.icon) : feature.icon}`"
                >
                  {{ typeof feature.icon === 'object' ? feature.icon?.name || '?' : feature.icon }}
                </span>
              </div>
            </div>
            <CardTitle>{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{{ feature.description }}</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
