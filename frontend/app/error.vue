<script setup lang="ts">
import type { NuxtError } from "#app";
import type { GlobalOptions } from "#shared/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Home, AlertCircle } from "lucide-vue-next";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import { useStrapi } from "~/composables/useStrapi";

const props = defineProps({
  error: Object as () => NuxtError,
});

// Fetch global options from Strapi (with fallback to mock data)
const { fetchGlobalOptions } = useStrapi();
const { data: globalOptions } = await useAsyncData<GlobalOptions | null>(
  "global-options-error",
  async () => {
    const data = await fetchGlobalOptions();
    return data;
  },
  {
    server: false, // Only fetch on client to avoid serialization issues
    lazy: true, // Don't block rendering
    default: () => null,
  }
);

const errorMessage = computed(() => {
  if (!props.error) return "An error occurred";
  if (props.error.statusCode === 404) {
    return "Page Not Found";
  }
  if (props.error.statusCode === 500) {
    return "Internal Server Error";
  }
  return props.error.statusMessage || "An error occurred";
});

const errorDescription = computed(() => {
  if (!props.error) return "We're sorry, but something went wrong.";
  if (props.error.statusCode === 404) {
    return "The page you're looking for doesn't exist or has been moved.";
  }
  if (props.error.statusCode === 500) {
    return "Something went wrong on our end. Please try again later.";
  }
  return props.error.message || "We're sorry, but something went wrong.";
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header
      v-if="globalOptions?.header"
      :logo="globalOptions.header.logo"
      :logo-text="globalOptions.header.logoText"
      :links="globalOptions.header.links"
    />

    <main class="flex-1 flex items-center justify-center px-4 py-[80px]">
      <Card class="max-w-md w-full text-center border-0">
        <CardHeader>
          <div class="flex justify-center mb-4">
            <div class="rounded-full bg-destructive/10 p-4">
              <AlertCircle class="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle class="text-4xl font-bold text-foreground">
            {{ error?.statusCode || "Error" }}
          </CardTitle>
          <CardDescription class="text-xl mt-2">
            {{ errorMessage }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-muted-foreground">
            {{ errorDescription }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink to="/">
              <Button size="lg" class="w-full sm:w-auto">
                <Home class="h-4 w-4 mr-2" />
                Go Back Home
              </Button>
            </NuxtLink>
            <Button
              v-if="error?.statusCode === 500"
              size="lg"
              variant="outline"
              class="w-full sm:w-auto"
              @click="clearError({ redirect: '/' })"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>

    <Footer
      v-if="globalOptions?.footer"
      :copyright="globalOptions.footer.copyright"
      :links="globalOptions.footer.links"
      :social-media="globalOptions.footer.socialMedia"
    />
  </div>
</template>
