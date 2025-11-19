<script setup lang="ts">
import type { Header } from "#shared/types";
import { Button } from "~/components/ui/button";
import { X, User, LogOut, Menu } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface Props {
  logo?: Header["logo"];
  logoText?: string;
  menu?: Header["menu"];
  links?: Header["links"];
}

const props = defineProps<Props>();

const flattenMenuItems = (items: any[]): any[] => {
  const result: any[] = [];
  items.forEach((item) => {
    result.push({
      text: item.title,
      url: item.url,
      children: item.children || [],
    });
    if (item.children && item.children.length > 0) {
      result.push(...flattenMenuItems(item.children));
    }
  });
  return result;
};

const navigationLinks = computed(() => {
  if (props.menu && props.menu.length > 0) {
    return props.menu.map((item) => ({
      text: item.title,
      url: item.url,
    }));
  }
  return props.links || [];
});

const route = useRoute();
const isMobileMenuOpen = ref(false);
const { isAuthenticated, user, logout } = useAuth();
const router = useRouter();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  logout();
  router.push("/");
};
</script>

<template>
  <header class="w-full shadow-xl bg-muted sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 no-underline hover:no-underline"
          >
            <img
              v-if="logo && logo.url"
              :src="logo.url"
              :alt="logo.alt || logoText || 'Logo'"
              class="h-8 w-auto"
              @error="console.error('Logo image failed to load:', logo.url)"
            />
            <span v-if="logoText" class="text-xl font-bold text-foreground">
              {{ logoText }}
            </span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div
          v-if="navigationLinks.length > 0"
          class="hidden md:flex items-center space-x-6"
        >
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.url"
            :to="link.url"
            class="text-sm font-medium text-foreground hover:text-primary transition-colors relative"
            :class="{
              'text-primary':
                route.path === link.url ||
                (link.url !== '/' && route.path.startsWith(link.url)),
            }"
          >
            {{ link.text }}
            <span
              v-if="
                route.path === link.url ||
                (link.url !== '/' && route.path.startsWith(link.url))
              "
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          </NuxtLink>
        </div>

        <!-- Auth Section -->
        <div class="hidden md:flex items-center gap-4">
          <!-- User Menu (if logged in) -->
          <DropdownMenu v-if="isAuthenticated">
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full">
                <User class="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {{ user?.username || user?.email || "User" }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <NuxtLink to="/account" class="flex items-center">
                  <User class="mr-2 h-4 w-4" />
                  My Account
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Login/Signup Buttons (if not logged in) -->
          <div v-else class="flex items-center gap-2">
            <Button as-child variant="ghost" size="sm">
              <NuxtLink to="/login">Login</NuxtLink>
            </Button>
            <Button as-child size="sm">
              <NuxtLink to="/signup">Sign Up</NuxtLink>
            </Button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center gap-2">
          <!-- Mobile Auth Button -->
          <DropdownMenu v-if="isAuthenticated">
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" class="h-9 w-9">
                <User class="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {{ user?.username || user?.email || "User" }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <NuxtLink to="/account" class="flex items-center">
                  <User class="mr-2 h-4 w-4" />
                  My Account
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9"
            @click="toggleMobileMenu"
          >
            <svg
              v-if="!isMobileMenuOpen"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <X v-else class="h-5 w-5" />
          </Button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden fixed top-16 right-0 bottom-0 w-64 bg-background border-l shadow-lg z-40 overflow-y-auto"
        >
          <nav class="p-4 space-y-4">
            <NuxtLink
              v-for="link in navigationLinks"
              :key="link.url"
              :to="link.url"
              @click="closeMobileMenu"
              class="block text-base font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border"
              :class="{
                'text-primary':
                  route.path === link.url ||
                  (link.url !== '/' && route.path.startsWith(link.url)),
              }"
            >
              {{ link.text }}
            </NuxtLink>
            
            <!-- Mobile Auth Links -->
            <div v-if="!isAuthenticated" class="pt-4 border-t space-y-2">
              <NuxtLink
                to="/login"
                @click="closeMobileMenu"
                class="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/signup"
                @click="closeMobileMenu"
                class="block text-base font-medium text-primary hover:underline transition-colors py-2"
              >
                Sign Up
              </NuxtLink>
            </div>
            <div v-else class="pt-4 border-t space-y-2">
              <div class="text-sm text-muted-foreground py-2">
                {{ user?.username || user?.email }}
              </div>
              <button
                @click="handleLogout; closeMobileMenu()"
                class="block w-full text-left text-base font-medium text-foreground hover:text-primary transition-colors py-2"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </Transition>
    </nav>
  </header>
</template>
