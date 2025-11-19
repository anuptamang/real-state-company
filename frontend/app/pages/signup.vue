<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  MapPin,
} from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const { signup, isAuthenticated } = useAuth();
const router = useRouter();
const route = useRoute();

// Redirect if already logged in
if (isAuthenticated.value) {
  navigateTo((route.query.redirect as string) || "/");
}

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  address: "",
});

const errors = ref<Record<string, string>>({});
const isLoading = ref(false);
const generalError = ref("");
const success = ref(false);

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // Username validation
  if (!form.value.username.trim()) {
    errors.value.username = "Username is required";
    isValid = false;
  } else if (form.value.username.trim().length < 3) {
    errors.value.username = "Username must be at least 3 characters";
    isValid = false;
  }

  // Email validation
  if (!form.value.email.trim()) {
    errors.value.email = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.email.trim())) {
      errors.value.email = "Please enter a valid email address";
      isValid = false;
    }
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = "Password is required";
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    isValid = false;
  }

  // Confirm password validation
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "Please confirm your password";
    isValid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  generalError.value = "";
  errors.value = {};
  success.value = false;

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const result = await signup(
      form.value.username.trim(),
      form.value.email.trim(),
      form.value.password,
      form.value.name.trim() || undefined,
      form.value.address.trim() || undefined
    );

    if (result.success) {
      success.value = true;
      // Redirect after a short delay
      setTimeout(() => {
        const redirectTo = (route.query.redirect as string) || "/";
        router.push(redirectTo);
      }, 1500);
    } else {
      generalError.value =
        result.error || "Registration failed. Please try again.";
    }
  } catch (error: any) {
    generalError.value = error?.message || "An unexpected error occurred";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12"
  >
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center"
          >Create Account</CardTitle
        >
        <CardDescription class="text-center">
          Sign up to leave reviews and comments on properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleSubmit" class="space-y-4">
          <!-- Success Message -->
          <div
            v-if="success"
            class="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm"
          >
            <CheckCircle2 class="h-4 w-4 shrink-0" />
            <span>Account created successfully! Redirecting...</span>
          </div>

          <!-- General Error -->
          <div
            v-else-if="generalError"
            class="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            <AlertCircle class="h-4 w-4 shrink-0" />
            <span>{{ generalError }}</span>
          </div>

          <!-- Username Field -->
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <div class="relative">
              <User
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="Choose a username"
                class="pl-10"
                :class="{
                  'border-destructive': errors.username,
                }"
                :disabled="isLoading || success"
              />
            </div>
            <p v-if="errors.username" class="text-sm text-destructive">
              {{ errors.username }}
            </p>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <div class="relative">
              <Mail
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                class="pl-10"
                :class="{
                  'border-destructive': errors.email,
                }"
                :disabled="isLoading || success"
              />
            </div>
            <p v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
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
                placeholder="Create a password"
                class="pl-10"
                :class="{
                  'border-destructive': errors.password,
                }"
                :disabled="isLoading || success"
              />
            </div>
            <p v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <div class="relative">
              <Lock
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                class="pl-10"
                :class="{
                  'border-destructive': errors.confirmPassword,
                }"
                :disabled="isLoading || success"
              />
            </div>
            <p v-if="errors.confirmPassword" class="text-sm text-destructive">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Name Field -->
          <div class="space-y-2">
            <Label for="name">Full Name (Optional)</Label>
            <div class="relative">
              <User
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter your full name"
                class="pl-10"
                :disabled="isLoading || success"
              />
            </div>
          </div>

          <!-- Address Field -->
          <div class="space-y-2">
            <Label for="address">Address (Optional)</Label>
            <div class="relative">
              <MapPin
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="address"
                v-model="form.address"
                type="text"
                placeholder="Enter your address"
                class="pl-10"
                :disabled="isLoading || success"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="isLoading || success">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>Create Account</span>
          </Button>

          <!-- Login Link -->
          <div class="text-center text-sm">
            <span class="text-muted-foreground">Already have an account? </span>
            <NuxtLink
              :to="`/login${
                route.query.redirect ? `?redirect=${route.query.redirect}` : ''
              }`"
              class="text-primary hover:underline font-medium"
            >
              Login
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
