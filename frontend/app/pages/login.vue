<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const { login, isAuthenticated } = useAuth();
const router = useRouter();
const route = useRoute();

// Redirect if already logged in
if (isAuthenticated.value) {
  navigateTo(route.query.redirect as string || "/");
}

const form = ref({
  identifier: "",
  password: "",
});

const errors = ref<Record<string, string>>({});
const isLoading = ref(false);
const generalError = ref("");

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.identifier.trim()) {
    errors.value.identifier = "Email or username is required";
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = "Password is required";
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  generalError.value = "";
  errors.value = {};

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const result = await login(
      form.value.identifier.trim(),
      form.value.password
    );

    if (result.success) {
      // Redirect to the page user was trying to access, or home
      const redirectTo = (route.query.redirect as string) || "/";
      await router.push(redirectTo);
    } else {
      generalError.value = result.error || "Login failed. Please try again.";
    }
  } catch (error: any) {
    generalError.value = error?.message || "An unexpected error occurred";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription class="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleSubmit" class="space-y-4">
          <!-- General Error -->
          <div
            v-if="generalError"
            class="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            <AlertCircle class="h-4 w-4 flex-shrink-0" />
            <span>{{ generalError }}</span>
          </div>

          <!-- Email/Username Field -->
          <div class="space-y-2">
            <Label for="identifier">Email or Username</Label>
            <div class="relative">
              <Mail
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="identifier"
                v-model="form.identifier"
                type="text"
                placeholder="Enter your email or username"
                class="pl-10"
                :class="{
                  'border-destructive': errors.identifier,
                }"
                :disabled="isLoading"
              />
            </div>
            <p v-if="errors.identifier" class="text-sm text-destructive">
              {{ errors.identifier }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Lock
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                class="pl-10"
                :class="{
                  'border-destructive': errors.password,
                }"
                :disabled="isLoading"
              />
            </div>
            <p v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </p>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>Login</span>
          </Button>

          <!-- Signup Link -->
          <div class="text-center text-sm">
            <span class="text-muted-foreground">Don't have an account? </span>
            <NuxtLink
              :to="`/signup${route.query.redirect ? `?redirect=${route.query.redirect}` : ''}`"
              class="text-primary hover:underline font-medium"
            >
              Sign up
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
