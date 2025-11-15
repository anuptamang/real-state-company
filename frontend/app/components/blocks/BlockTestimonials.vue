<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Card, CardContent } from "~/components/ui/card";
import { Star } from "lucide-vue-next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number;
  avatar?: {
    url: string;
    alt?: string;
  };
}

interface Props {
  title?: string;
  testimonials: Testimonial[];
}

const props = defineProps<Props>();

const modules = [Navigation, Pagination, Autoplay];

// Check if we have enough slides to show navigation and pagination
const showNavigation = computed(() => {
  return props.testimonials.length > 3; // Show navigation if more than 3 slides (desktop view)
});

const showPagination = computed(() => {
  return props.testimonials.length > 1; // Show pagination if more than 1 slide
});
</script>

<template>
  <section class="w-full py-16 px-4 bg-muted">
    <div class="max-w-7xl mx-auto">
      <h2
        v-if="title"
        class="text-4xl font-bold text-center mb-12 text-foreground"
      >
        {{ title }}
      </h2>

      <div class="relative">
        <!-- Navigation Buttons - Above Swiper on Right -->
        <div v-if="showNavigation" class="flex justify-end gap-2 mb-4">
          <button
            class="swiper-button-prev-custom testimonials-nav-btn"
            aria-label="Previous"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            class="swiper-button-next-custom testimonials-nav-btn"
            aria-label="Next"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }"
          :pagination="
            showPagination
              ? {
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet-custom',
                  bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                }
              : false
          "
          :navigation="
            showNavigation
              ? {
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
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
              slidesPerView: 3,
            },
          }"
          class="pb-12 testimonials-swiper"
        >
          <SwiperSlide
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="h-auto!"
          >
            <Card class="h-full flex flex-col border-0">
              <CardContent class="pt-6 h-full">
                <div class="flex items-center gap-4 mb-4">
                  <img
                    v-if="testimonial.avatar"
                    :src="testimonial.avatar.url"
                    :alt="testimonial.avatar.alt || testimonial.name"
                    class="w-16 h-16 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <span class="text-2xl font-bold text-primary">
                      {{ testimonial.name.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground">
                      {{ testimonial.name }}
                    </h3>
                    <p
                      v-if="testimonial.role"
                      class="text-sm text-muted-foreground"
                    >
                      {{ testimonial.role }}
                    </p>
                  </div>
                </div>

                <div v-if="testimonial.rating" class="flex gap-1 mb-4">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    class="h-4 w-4"
                    :class="
                      i <= (testimonial.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    "
                  />
                </div>

                <p class="text-muted-foreground italic flex-grow">
                  "{{ testimonial.content }}"
                </p>
              </CardContent>
            </Card>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-foreground);
  transition: all 0.3s ease;
  cursor: pointer;
}

.testimonials-nav-btn:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.testimonials-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.testimonials-swiper :deep(.swiper-button-prev-custom),
.testimonials-swiper :deep(.swiper-button-next-custom) {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
}

.testimonials-swiper :deep(.swiper-button-prev-custom::after),
.testimonials-swiper :deep(.swiper-button-next-custom::after) {
  display: none;
}

.testimonials-swiper :deep(.swiper-pagination) {
  position: relative;
  bottom: 0;
  margin-top: 1rem;
}

.testimonials-swiper :deep(.swiper-pagination-bullet-custom) {
  width: 12px;
  height: 12px;
  background: var(--color-muted-foreground);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.testimonials-swiper :deep(.swiper-pagination-bullet-active-custom) {
  background: var(--color-primary);
  width: 32px;
  border-radius: 6px;
  opacity: 1;
}
</style>
