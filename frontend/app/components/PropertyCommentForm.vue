<script setup lang="ts">
import type { PropertyComment } from "#shared/types";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertCircle, Loader2, CheckCircle2, X } from "lucide-vue-next";

interface Props {
  propertyId: string | number;
  parentId?: number | null;
  onSuccess?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  parentId: null,
  onSuccess: undefined,
});

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const config = useRuntimeConfig();
const { getAuthHeaders, isAuthenticated } = useAuth();
const strapiUrl = config.public.strapiUrl;
const router = useRouter();

const form = ref({
  comment: "",
});

const errors = ref<Record<string, string>>({});
const isLoading = ref(false);
const generalError = ref("");
const success = ref(false);

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.comment.trim()) {
    errors.value.comment = "Comment is required";
    isValid = false;
  } else if (form.value.comment.trim().length < 3) {
    errors.value.comment = "Comment must be at least 3 characters";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  generalError.value = "";
  errors.value = {};
  success.value = false;

  if (!isAuthenticated.value) {
    router.push({
      path: "/login",
      query: {
        redirect: router.currentRoute.value.fullPath,
      },
    });
    return;
  }

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const baseUrl = strapiUrl?.startsWith("http")
      ? strapiUrl
      : `http://${strapiUrl}`;

    // Ensure property ID is a number for Strapi relations
    const propertyId =
      typeof props.propertyId === "string"
        ? parseInt(props.propertyId, 10)
        : props.propertyId;

    if (isNaN(propertyId) || !propertyId) {
      throw new Error("Invalid property ID");
    }

    const bodyData: any = {
      property: propertyId,
      comment: form.value.comment.trim(),
    };

    if (props.parentId) {
      // Ensure parent ID is a number for Strapi relations
      const parentId =
        typeof props.parentId === "string"
          ? parseInt(props.parentId, 10)
          : props.parentId;
      if (!isNaN(parentId) && parentId) {
        bodyData.parent = parentId;
      }
    }

    console.log("Submitting comment with data:", bodyData);

    const response = await $fetch<{ data: PropertyComment }>(
      `${baseUrl}/api/property-comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: {
          data: bodyData,
        },
      }
    );

    success.value = true;

    // Reset form
    form.value.comment = "";

    // Call onSuccess callback if provided
    if (props.onSuccess) {
      props.onSuccess();
    } else {
      // Refresh page after a short delay
      setTimeout(() => {
        navigateTo(router.currentRoute.value.fullPath, {
          replace: true,
          force: true,
        });
      }, 1000);
    }

    // Emit cancel to close reply form if it's a reply
    if (props.parentId) {
      setTimeout(() => {
        emit("cancel");
      }, 1500);
    }
  } catch (error: any) {
    console.error("Comment submission error:", error);
    console.error("Error details:", error?.data);
    const errorMessage =
      error?.data?.error?.message ||
      error?.data?.error?.details?.message ||
      error?.message ||
      "Failed to submit comment. Please try again.";
    generalError.value = errorMessage;
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  form.value.comment = "";
  errors.value = {};
  generalError.value = "";
  emit("cancel");
};
</script>

<template>
  <Card>
    <CardHeader v-if="!parentId">
      <CardTitle>Leave a Comment</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit="handleSubmit" class="space-y-4">
        <!-- Success Message -->
        <div
          v-if="success"
          class="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm"
        >
          <CheckCircle2 class="h-4 w-4 flex-shrink-0" />
          <span>
            {{
              parentId
                ? "Reply submitted! It will be visible after approval."
                : "Comment submitted! It will be visible after approval."
            }}
          </span>
        </div>

        <!-- General Error -->
        <div
          v-else-if="generalError"
          class="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
        >
          <AlertCircle class="h-4 w-4 flex-shrink-0" />
          <span>{{ generalError }}</span>
        </div>

        <!-- Comment Field -->
        <div class="space-y-2">
          <Textarea
            id="comment"
            v-model="form.comment"
            :placeholder="
              parentId
                ? 'Write your reply...'
                : 'Share your thoughts about this property...'
            "
            rows="4"
            :class="{
              'border-destructive': errors.comment,
            }"
            :disabled="isLoading || success"
          />
          <p v-if="errors.comment" class="text-sm text-destructive">
            {{ errors.comment }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center gap-2">
          <Button type="submit" :disabled="isLoading || success">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>{{ parentId ? "Reply" : "Post Comment" }}</span>
          </Button>
          <Button
            v-if="parentId"
            type="button"
            variant="ghost"
            size="sm"
            @click="handleCancel"
            :disabled="isLoading || success"
          >
            <X class="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
