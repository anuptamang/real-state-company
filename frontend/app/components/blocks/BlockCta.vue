<script setup lang="ts">
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ArrowRight } from "lucide-vue-next";
import { getLucideIcon } from "~/utils/lucide-icons";
import type { Component } from "vue";

interface Props {
  heading?: string;
  text?: string;
  icon?:
    | string
    | {
        url: string;
        alt?: string;
      };
  button?: {
    text: string;
    url: string;
  };
}

const props = defineProps<Props>();

// Check if icon is an uploaded image (object with url)
const isUploadedIcon = (
  icon?: string | { url: string; alt?: string }
): icon is { url: string; alt?: string } => {
  return typeof icon === "object" && icon !== null && "url" in icon;
};

// Get Lucide icon component dynamically
const getIcon = (iconName?: string): Component | null => {
  if (!iconName || typeof iconName !== "string") return null;
  return getLucideIcon(iconName);
};
</script>

<template>
  <section class="w-full py-16 px-4 bg-muted">
    <Card class="max-w-3xl mx-auto text-center border-0">
      <CardHeader>
        <div class="flex justify-center mb-4">
          <div class="rounded-full bg-primary/10 p-4">
            <!-- Uploaded icon (image) -->
            <img
              v-if="icon && isUploadedIcon(icon)"
              :src="icon.url"
              :alt="icon.alt || heading || 'CTA icon'"
              class="h-8 w-8 object-contain"
            />
            <!-- Lucide icon from string -->
            <component
              v-else-if="icon && typeof icon === 'string' && getIcon(icon)"
              :is="getIcon(icon)"
              class="h-8 w-8 text-primary"
            />
            <!-- Lucide icon from object (shared.icon component) -->
            <component
              v-else-if="icon && typeof icon === 'object' && icon?.name && getIcon(icon.name)"
              :is="getIcon(icon.name)"
              class="h-8 w-8 text-primary"
            />
            <!-- Default Lucide icon -->
            <ArrowRight v-else class="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle v-if="heading" class="text-3xl font-bold mb-4">
          {{ heading }}
        </CardTitle>
        <CardDescription v-if="text" class="text-lg mb-6">
          {{ text }}
        </CardDescription>
      </CardHeader>
      <CardContent v-if="button">
        <NuxtLink :to="button.url">
          <Button variant="default" size="lg" class="mt-4">
            {{ button.text }}
          </Button>
        </NuxtLink>
      </CardContent>
    </Card>
  </section>
</template>
