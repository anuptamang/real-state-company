<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { User, Mail, MapPin, AlertCircle, Loader2, CheckCircle2 } from "lucide-vue-next";
import type { UserProfile } from "#shared/types";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { user, getUserProfile, updateUserProfile } = useAuth();
const router = useRouter();

const profile = ref<UserProfile | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const success = ref(false);
const generalError = ref("");

const form = ref({
  username: "",
  email: "",
  name: "",
  address: "",
});

// Load user profile
const loadProfile = async () => {
  if (!user.value) return;

  isLoading.value = true;
  try {
    form.value.username = user.value.username || "";
    form.value.email = user.value.email || "";

    const userProfile = await getUserProfile();
    if (userProfile) {
      profile.value = userProfile;
      form.value.name = userProfile.name || "";
      form.value.address = userProfile.address || "";
    }
  } catch (error) {
    console.error("Failed to load profile:", error);
  } finally {
    isLoading.value = false;
  }
};

// Load profile on mount
onMounted(() => {
  loadProfile();
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  generalError.value = "";
  success.value = false;
  isSaving.value = true;

  try {
    const result = await updateUserProfile(
      form.value.name.trim() || undefined,
      form.value.address.trim() || undefined
    );

    if (result.success) {
      success.value = true;
      // Reload profile to get updated data
      await loadProfile();
      // Clear success message after 3 seconds
      setTimeout(() => {
        success.value = false;
      }, 3000);
    } else {
      generalError.value = result.error || "Failed to update profile";
    }
  } catch (error: any) {
    generalError.value = error?.message || "An unexpected error occurred";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-muted/30 px-4 py-12">
    <div class="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl font-bold">My Account</CardTitle>
          <CardDescription>
            Manage your account information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
          </div>

          <form v-else @submit="handleSubmit" class="space-y-6">
            <!-- Success Message -->
            <div
              v-if="success"
              class="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm"
            >
              <CheckCircle2 class="h-4 w-4 flex-shrink-0" />
              <span>Profile updated successfully!</span>
            </div>

            <!-- General Error -->
            <div
              v-if="generalError"
              class="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              <AlertCircle class="h-4 w-4 shrink-0" />
              <span>{{ generalError }}</span>
            </div>

            <!-- Account Information Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Account Information</h3>

              <!-- Username Field (Read-only) -->
              <div class="space-y-2">
                <Label for="username">Username</Label>
                <div class="relative">
                  <User
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="username"
                    :value="form.username"
                    type="text"
                    class="pl-10 bg-muted"
                    disabled
                  />
                </div>
                <p class="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>

              <!-- Email Field (Read-only) -->
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <div class="relative">
                  <Mail
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    :value="form.email"
                    type="email"
                    class="pl-10 bg-muted"
                    disabled
                  />
                </div>
                <p class="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <!-- Profile Information Section -->
            <div class="space-y-4 pt-4 border-t">
              <h3 class="text-lg font-semibold">Profile Information</h3>

              <!-- Name Field -->
              <div class="space-y-2">
                <Label for="name">Full Name</Label>
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
                    :disabled="isSaving"
                  />
                </div>
              </div>

              <!-- Address Field -->
              <div class="space-y-2">
                <Label for="address">Address</Label>
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
                    :disabled="isSaving"
                  />
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
              <Button type="submit" :disabled="isSaving">
                <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
                <span v-else>Save Changes</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
