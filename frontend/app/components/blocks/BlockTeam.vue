<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Linkedin, Mail } from "lucide-vue-next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: {
    url: string;
    alt?: string;
  };
  email?: string;
  linkedin?: string;
}

interface Props {
  title?: string;
  team: TeamMember[];
}

const props = defineProps<Props>();

const modules = [Navigation, Pagination, Autoplay];

// Check if we have enough slides to show navigation and pagination
const showNavigation = computed(() => {
  return props.team.length > 4; // Show navigation if more than 4 slides (desktop view)
});

const showPagination = computed(() => {
  return props.team.length > 1; // Show pagination if more than 1 slide
});
</script>

<template>
  <section class="w-full py-16 px-4 bg-background">
    <div class="max-w-7xl mx-auto">
      <h2
        v-if="title"
        class="text-4xl font-bold text-center mb-5 text-foreground"
      >
        {{ title }}
      </h2>

      <div class="relative">
        <!-- Navigation Buttons - Above Swiper on Right -->
        <div v-if="showNavigation" class="flex justify-end gap-2 mb-4">
          <button
            class="swiper-button-prev-custom team-nav-btn"
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
            class="swiper-button-next-custom team-nav-btn"
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
            delay: 4000,
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
            1280: {
              slidesPerView: 4,
            },
          }"
          class="pb-12 team-swiper"
        >
          <SwiperSlide
            v-for="member in team"
            :key="member.id"
            class="h-auto! py-8"
          >
            <Card
              class="h-full border-0 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col my-0"
            >
              <CardHeader>
                <div class="relative w-32 h-32 mx-auto mb-4">
                  <img
                    v-if="member.image"
                    :src="member.image.url"
                    :alt="member.image.alt || member.name"
                    class="w-full h-full rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <span class="text-4xl font-bold text-primary">
                      {{ member.name.charAt(0) }}
                    </span>
                  </div>
                </div>
                <CardTitle>{{ member.name }}</CardTitle>
                <CardDescription>{{ member.role }}</CardDescription>
              </CardHeader>
              <CardContent class="flex-grow flex flex-col">
                <p
                  v-if="member.bio"
                  class="text-sm text-muted-foreground mb-4 flex-grow"
                >
                  {{ member.bio }}
                </p>
                <div class="flex justify-center gap-4 mt-auto">
                  <a
                    v-if="member.email"
                    :href="`mailto:${member.email}`"
                    class="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Email"
                  >
                    <Mail class="h-5 w-5" />
                  </a>
                  <a
                    v-if="member.linkedin"
                    :href="member.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin class="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-nav-btn {
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

.team-nav-btn:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.team-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.team-swiper :deep(.swiper-button-prev-custom),
.team-swiper :deep(.swiper-button-next-custom) {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
}

.team-swiper :deep(.swiper-button-prev-custom::after),
.team-swiper :deep(.swiper-button-next-custom::after) {
  display: none;
}

.team-swiper :deep(.swiper-pagination) {
  position: relative;
  bottom: 0;
  margin-top: 1rem;
}

.team-swiper :deep(.swiper-pagination-bullet-custom) {
  width: 12px;
  height: 12px;
  background: var(--color-muted-foreground);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.team-swiper :deep(.swiper-pagination-bullet-active-custom) {
  background: var(--color-primary);
  width: 32px;
  border-radius: 6px;
  opacity: 1;
}
</style>
