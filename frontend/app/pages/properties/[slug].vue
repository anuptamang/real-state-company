<script setup lang="ts">
import { useStrapi } from "~/composables/useStrapi";
import { useMockData } from "~/composables/useMockData";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

// Define page meta with key based on route param (slug) to force remount on route change
definePageMeta({
  key: (route) => route.fullPath,
});

const route = useRoute();
const { fetchProperty } = useStrapi();
const { getPropertyBySlug } = useMockData();

interface Property {
  id: string;
  strapiId?: number; // Numeric ID for Strapi relations
  slug: string;
  title: string;
  price: number;
  location: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  images?: Array<{
    url: string;
    alt?: string;
  }>;
}

// Get the slug from route params
const propertySlug = computed(() => {
  const slug = route.params.slug;
  // Handle both string and array cases
  return Array.isArray(slug) ? slug[0] : String(slug);
});

// Fetch property data - use computed slug since definePageMeta will remount component
const property = await useAsyncData<Property | null>(
  `property-${propertySlug.value}`,
  async () => {
    const prop = await fetchProperty(propertySlug.value);
    return prop || null;
  }
);

if (!property.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Property not found",
  });
}

const propertyData = computed(() => property.data.value!);

// Debug: Log property data to check strapiId
if (process.client) {
  watch(
    () => propertyData.value,
    (prop) => {
      if (prop) {
        console.log("Property data:", {
          id: prop.id,
          strapiId: (prop as any).strapiId,
          title: prop.title,
        });
      }
    },
    { immediate: true }
  );
}

useHead({
  title: propertyData.value.title || "Property Details",
  meta: [
    {
      name: "description",
      content: propertyData.value.description || "Property details",
    },
  ],
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

// Lightbox state
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const galleryImages = computed(() => {
  return propertyData.value.images || [];
});

const allImages = computed(() => {
  return propertyData.value.images || [];
});

const openLightbox = (index: number) => {
  lightboxIndex.value = index; // Use the actual index from gallery
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = "";
};

const nextImage = () => {
  if (lightboxIndex.value < allImages.value.length - 1) {
    lightboxIndex.value++;
  }
};

const prevImage = () => {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--;
  }
};

// Swiper modules
const modules = [Navigation, Pagination, Thumbs];

// Show navigation if there are more than 2 images
const showNavigation = computed(() => {
  return galleryImages.value.length > 2;
});

// Show pagination if there are more than 1 image
const showPagination = computed(() => {
  return galleryImages.value.length > 1;
});

// Reply state
const replyingTo = ref<number | null>(null);
const { isAuthenticated } = useAuth();

const handleReply = (commentId: number) => {
  if (!isAuthenticated.value) {
    // Redirect to login if not authenticated
    navigateTo({
      path: "/login",
      query: {
        redirect: route.fullPath,
      },
    });
    return;
  }
  replyingTo.value = commentId;
  // Scroll to comment form
  nextTick(() => {
    const formElement = document.querySelector(
      '[data-comment-form]'
    ) as HTMLElement;
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Image with Overlay -->
    <div
      v-if="propertyData.images?.[0]"
      class="relative h-[70vh] overflow-hidden"
    >
      <img
        :src="propertyData.images[0].url"
        :alt="propertyData.images[0].alt || propertyData.title"
        class="w-full h-full object-cover"
      />
      <!-- Enhanced Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
      />
      <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
        <div class="container mx-auto">
          <h1
            class="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg text-white"
          >
            {{ propertyData.title }}
          </h1>
          <p
            class="text-xl md:text-3xl font-semibold mb-4 drop-shadow-md text-white"
          >
            {{ formatPrice(propertyData.price) }}
          </p>
          <div class="flex items-center gap-2 text-white/90">
            <MapPin class="h-5 w-5" />
            <p class="text-lg text-white m-0">{{ propertyData.location }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Property Details -->
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div v-if="propertyData.bedrooms" class="flex gap-3">
                  <div class="p-3 rounded-lg text-primary">
                    <Bed class="h-6 w-6" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground m-0">Bedrooms</p>
                    <p class="text-xl font-bold m-0">
                      {{ propertyData.bedrooms }}
                    </p>
                  </div>
                </div>
                <div v-if="propertyData.bathrooms" class="flex gap-3">
                  <div class="p-3 rounded-lg text-primary">
                    <Bath class="h-6 w-6" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground m-0">Bathrooms</p>
                    <p class="text-xl font-bold m-0">
                      {{ propertyData.bathrooms }}
                    </p>
                  </div>
                </div>
                <div v-if="propertyData.sqft" class="flex gap-3">
                  <div class="p-3 rounded-lg text-primary">
                    <Square class="h-6 w-6" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground m-0">Square Feet</p>
                    <p class="text-xl font-bold m-0">
                      {{ propertyData.sqft.toLocaleString() }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="p-3 rounded-lg text-primary">
                    <MapPin class="h-6 w-6" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground m-0">Location</p>
                    <a
                      :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        propertyData.location
                      )}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xl font-bold text-sm m-0 text-primary hover:underline transition-colors"
                    >
                      {{ propertyData.location }}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Description -->
          <Card v-if="propertyData.description">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground leading-relaxed text-lg">
                {{ propertyData.description }}
              </p>
            </CardContent>
          </Card>

          <!-- Image Gallery with Swiper -->
          <Card v-if="galleryImages.length > 0">
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="relative">
                <!-- Navigation Buttons -->
                <div v-if="showNavigation" class="flex justify-end gap-2 mb-4">
                  <button
                    class="gallery-button-prev property-gallery-nav-btn"
                    aria-label="Previous"
                  >
                    <ChevronLeft class="h-5 w-5" />
                  </button>
                  <button
                    class="gallery-button-next property-gallery-nav-btn"
                    aria-label="Next"
                  >
                    <ChevronRight class="h-5 w-5" />
                  </button>
                </div>

                <Swiper
                  :modules="modules"
                  :slides-per-view="1"
                  :space-between="20"
                  :watch-slides-progress="true"
                  :watch-overflow="true"
                  :lazy="false"
                  :pagination="
                    showPagination
                      ? {
                          clickable: true,
                          bulletClass: 'swiper-pagination-bullet-custom',
                          bulletActiveClass:
                            'swiper-pagination-bullet-active-custom',
                        }
                      : false
                  "
                  :navigation="
                    showNavigation
                      ? {
                          nextEl: '.gallery-button-next',
                          prevEl: '.gallery-button-prev',
                        }
                      : false
                  "
                  :breakpoints="{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 2,
                    },
                  }"
                  class="pb-12 property-gallery-swiper"
                >
                  <SwiperSlide
                    v-for="(image, index) in galleryImages"
                    :key="`gallery-${propertyData.id}-${image.url}-${index}`"
                  >
                    <div
                      class="relative h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer group"
                      @click="openLightbox(index)"
                    >
                      <img
                        :src="image.url"
                        :alt="image.alt || propertyData.title"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div
                        class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </CardContent>
          </Card>

          <!-- Comments Section -->
          <div class="space-y-6">
            <PropertyComments
              :property-id="propertyData.strapiId || propertyData.id"
              @reply="handleReply"
            />
            <!-- Show comment form for authenticated users, but only if there are comments or if not replying -->
            <div
              v-if="isAuthenticated && !replyingTo"
              data-comment-form
            >
              <PropertyCommentForm
                :property-id="propertyData.strapiId || propertyData.id"
              />
            </div>
            <!-- Show reply form when replying -->
            <div
              v-if="isAuthenticated && replyingTo"
              data-comment-form
            >
              <PropertyCommentForm
                :property-id="propertyData.strapiId || propertyData.id"
                :parent-id="replyingTo"
                @cancel="replyingTo = null"
              />
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact Card -->
          <Card>
            <CardHeader>
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <Button class="w-full" size="lg">
                <Phone class="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button class="w-full" variant="outline" size="lg">
                <Mail class="h-4 w-4 mr-2" />
                Email Agent
              </Button>
              <div class="pt-4 border-t">
                <p class="text-sm text-muted-foreground mb-2">
                  Schedule a viewing
                </p>
                <Button class="w-full" variant="default">
                  Schedule Viewing
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Price Card -->
          <Card>
            <CardHeader>
              <CardTitle>Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-3xl font-bold text-primary">
                {{ formatPrice(propertyData.price) }}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        @click.self="closeLightbox"
      >
        <!-- Close Button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close"
        >
          <X class="h-6 w-6" />
        </button>

        <!-- Previous Button -->
        <button
          v-if="lightboxIndex > 0"
          @click="prevImage"
          class="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft class="h-6 w-6" />
        </button>

        <!-- Next Button -->
        <button
          v-if="lightboxIndex < allImages.length - 1"
          @click="nextImage"
          class="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight class="h-6 w-6" />
        </button>

        <!-- Image -->
        <div class="max-w-7xl w-full h-full flex items-center justify-center">
          <img
            :src="allImages[lightboxIndex]?.url"
            :alt="allImages[lightboxIndex]?.alt || propertyData.title"
            class="max-w-full max-h-full object-contain"
          />
        </div>

        <!-- Image Counter -->
        <div
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm"
        >
          {{ lightboxIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.property-gallery-nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-foreground);
  cursor: pointer;
  transition: all 0.2s;
}

.property-gallery-nav-btn:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: var(--color-primary);
}

.property-gallery-swiper :deep(.swiper-pagination) {
  bottom: 0;
  position: relative;
  margin-top: 1rem;
}

.property-gallery-swiper :deep(.swiper-pagination-bullet-custom) {
  width: 10px;
  height: 10px;
  background: var(--color-muted-foreground);
  opacity: 0.5;
  transition: all 0.2s;
}

.property-gallery-swiper :deep(.swiper-pagination-bullet-active-custom) {
  background: var(--color-primary);
  opacity: 1;
}
</style>
