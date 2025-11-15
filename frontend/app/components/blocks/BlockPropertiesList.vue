<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-vue-next";
import { useMockData } from "~/composables/useMockData";

// Placeholder image URL
const placeholderImage =
  "https://via.placeholder.com/800x600/cccccc/666666?text=Property+Image";

interface Property {
  id: string;
  slug: string; // Required - all properties must have a slug
  title: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  image?: {
    url: string;
    alt?: string;
  };
}

interface Props {
  title?: string;
  properties: Property[];
  initialLoad?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialLoad: 6,
});

// Get all properties to map slugs by ID (fallback if slug is missing)
const { getAllProperties } = useMockData();
const allProperties = getAllProperties();

// Enrich properties with slugs if missing (fallback mechanism)
const enrichedProperties = computed(() => {
  return props.properties.map((prop) => {
    // If slug is missing, find it from allProperties by ID
    if (!prop.slug) {
      const fullProperty = allProperties.find(
        (p) => String(p.id) === String(prop.id)
      );
      if (fullProperty?.slug) {
        return { ...prop, slug: fullProperty.slug };
      }
    }
    return prop;
  });
});

const displayedCount = ref(props.initialLoad);
const isLoading = ref(false);
const observerTarget = ref<HTMLElement | null>(null);

const displayedProperties = computed(() => {
  return enrichedProperties.value.slice(0, displayedCount.value);
});

const hasMore = computed(() => {
  return displayedCount.value < enrichedProperties.value.length;
});

const loadMore = () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  // Simulate loading delay
  setTimeout(() => {
    displayedCount.value += props.initialLoad;
    isLoading.value = false;
  }, 300);
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Use nextTick to ensure the DOM is fully rendered
  nextTick(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
            loadMore();
          }
        },
        {
          rootMargin: "100px",
          threshold: 0.1,
        }
      );

      // Observe the target element
      if (observerTarget.value) {
        observer.observe(observerTarget.value);
      }
    }
  });
});

// Watch for changes to observerTarget and re-observe
watch(observerTarget, (newTarget) => {
  if (observer && newTarget) {
    observer.observe(newTarget);
  }
});

onUnmounted(() => {
  if (observer) {
    if (observerTarget.value) {
      observer.unobserve(observerTarget.value);
    }
    observer.disconnect();
  }
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img.src !== placeholderImage) {
    img.src = placeholderImage;
  }
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
        <Card
          v-for="property in displayedProperties"
          :key="property.id"
          class="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
        >
          <div class="relative h-64 overflow-hidden">
            <img
              v-if="property.image"
              :src="property.image.url"
              :alt="property.image.alt || property.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full bg-muted flex items-center justify-center"
            >
              <img
                :src="placeholderImage"
                :alt="property.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold"
            >
              {{ formatPrice(property.price) }}
            </div>
          </div>

          <CardHeader>
            <CardTitle class="text-xl">{{ property.title }}</CardTitle>
            <CardDescription class="flex items-center gap-1">
              <MapPin class="h-4 w-4" />
              {{ property.location }}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div
              class="flex items-center gap-4 mb-4 text-sm text-muted-foreground"
            >
              <div v-if="property.bedrooms" class="flex items-center gap-1">
                <Bed class="h-4 w-4" />
                <span>{{ property.bedrooms }} Bed</span>
              </div>
              <div v-if="property.bathrooms" class="flex items-center gap-1">
                <Bath class="h-4 w-4" />
                <span>{{ property.bathrooms }} Bath</span>
              </div>
              <div v-if="property.sqft" class="flex items-center gap-1">
                <Square class="h-4 w-4" />
                <span>{{ property.sqft.toLocaleString() }} sqft</span>
              </div>
            </div>

            <NuxtLink :to="`/properties/${property.slug}`">
              <Button class="w-full">View Details</Button>
            </NuxtLink>
          </CardContent>
        </Card>
      </div>

      <!-- Load More Trigger -->
      <div v-if="hasMore" class="mt-8 flex justify-center">
        <div ref="observerTarget" class="h-20 flex items-center justify-center">
          <Button
            v-if="!isLoading"
            @click="loadMore"
            variant="outline"
            class="w-full md:w-auto"
          >
            Load More Properties
          </Button>
          <div v-else class="text-center text-muted-foreground">
            Loading more properties...
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
