<script setup lang="ts">
import type { Footer } from "#shared/types";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Globe,
} from "lucide-vue-next";

interface Props {
  links?: Footer["links"];
  socialMedia?: Footer["socialMedia"];
  menu?: Footer["menu"];
  siteUrl?: string;
  siteName?: string;
  copyright?: string;
}

const props = defineProps<Props>();

const footerLinks = computed(() => {
  if (props.menu && props.menu.length > 0) {
    return props.menu.map((item) => ({
      text: item.title,
      url: item.url,
    }));
  }
  return props.links || [];
});

const domainIconMap: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  mailto: Mail,
  gmail: Mail,
};

const getDomainFromUrl = (url: string): string | null => {
  try {
    if (url.startsWith("mailto:")) {
      return "mailto";
    }

    const urlObj = new URL(url);
    let hostname = urlObj.hostname.toLowerCase();

    hostname = hostname.replace(/^www\./, "");

    if (hostname === "x.com" || hostname.includes("twitter.com")) {
      return "twitter";
    }

    const domainParts = hostname.split(".");

    if (domainParts.length >= 2) {
      const lastTwo = domainParts.slice(-2).join(".");
      const commonTLDs = ["co.uk", "com.au", "co.nz", "com.br"];

      if (commonTLDs.includes(lastTwo) && domainParts.length >= 3) {
        const domain = domainParts[domainParts.length - 3];
        return domain || null;
      }

      const domain = domainParts[domainParts.length - 2];
      return domain || null;
    }

    return hostname;
  } catch (error) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    if (match && match[1]) {
      const hostname = match[1].toLowerCase();
      const domainParts = hostname.split(".");
      if (domainParts.length >= 2) {
        const domain = domainParts[domainParts.length - 2];
        return domain || null;
      }
      return hostname;
    }
    return null;
  }
};

const getIconFromUrl = (url: string) => {
  const domain = getDomainFromUrl(url);
  if (!domain) return Globe;

  const icon = domainIconMap[domain];
  return icon || Globe;
};
</script>

<template>
  <footer class="w-full bg-black mt-auto border-t">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Footer Links -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-white">Quick Links</h3>
          <ul v-if="footerLinks.length > 0" class="space-y-2 list-none pl-0">
            <li v-for="link in footerLinks" :key="link.url">
              <NuxtLink
                :to="link.url"
                class="text-sm text-muted-foreground hover:text-white transition-colors hover:no-underline"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social Media -->
        <div v-if="socialMedia && socialMedia.length > 0" class="space-y-4">
          <h3 class="text-sm font-semibold text-white">Follow Us</h3>
          <div class="flex space-x-4">
            <a
              v-for="social in socialMedia"
              :key="social.url"
              :href="social.url"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-white transition-colors"
            >
              <span class="sr-only">{{ social.name }}</span>
              <component :is="getIconFromUrl(social.url)" class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Copyright -->
        <div v-if="copyright || siteName || siteUrl" class="space-y-4">
          <p class="text-sm text-muted-foreground">
            <template v-if="copyright">
              {{ copyright }}
            </template>
            <template v-else>
              &copy; {{ new Date().getFullYear() }}
              <template v-if="siteUrl && siteName">
                <a
                  :href="siteUrl"
                  class="text-muted-foreground hover:text-white transition-colors no-underline"
                  >{{ siteName }}</a
                >
              </template>
              <template v-else-if="siteName">
                {{ siteName }}
              </template>
              <template v-else-if="siteUrl">
                <a
                  :href="siteUrl"
                  class="text-muted-foreground hover:text-white transition-colors no-underline"
                  >{{ siteUrl }}</a
                >
              </template>
              . All rights reserved.
            </template>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
