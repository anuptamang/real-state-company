<script setup lang="ts">
import type { PropertyComment } from "#shared/types";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { User as UserIcon, MessageSquare } from "lucide-vue-next";

interface Props {
  propertyId: string | number;
  comments?: PropertyComment[];
}

const props = defineProps<Props>();
const config = useRuntimeConfig();
const route = useRoute();
const { getAuthHeaders, isAuthenticated } = useAuth();
const strapiUrl = config.public.strapiUrl;

// Fetch comments if not provided
const commentsData = await useAsyncData<PropertyComment[]>(
  `property-comments-${props.propertyId}`,
  async () => {
    if (props.comments) {
      return props.comments;
    }

    try {
      const baseUrl = strapiUrl?.startsWith("http")
        ? strapiUrl
        : `http://${strapiUrl}`;

      const response = await $fetch<{ data: PropertyComment[] }>(
        `${baseUrl}/api/property-comments`,
        {
          params: {
            "filters[property][id][$eq]": props.propertyId,
            "filters[parent][$null]": true, // Only top-level comments
            "populate[user][fields][0]": "username",
            "populate[user][fields][1]": "email",
            "populate[replies][populate][user][fields][0]": "username",
            "populate[replies][populate][user][fields][1]": "email",
            sort: "createdAt:desc",
          },
          headers: getAuthHeaders(),
        }
      );

      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      return [];
    }
  },
  {
    default: () => props.comments || [],
  }
);

const comments = computed(() => commentsData.data.value || []);

// Get display name from user object (prefer profile name, fallback to username/email)
const getDisplayName = (comment: PropertyComment) => {
  if (typeof comment.user === "object" && comment.user) {
    const userWithProfile = comment.user as any;
    // Check if user has a profile with a name (attached by backend)
    if (userWithProfile.profile?.name) {
      return userWithProfile.profile.name;
    }
    // Fallback to username or email
    return userWithProfile.username || userWithProfile.email || "Anonymous";
  }
  return "Anonymous";
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

// Emit event for replying
const emit = defineEmits<{
  (e: "reply", commentId: number): void;
}>();

const handleReply = (commentId: number) => {
  emit("reply", commentId);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Comments Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <MessageSquare class="h-6 w-6" />
          Comments
        </h2>
        <p v-if="comments.length > 0" class="text-sm text-muted-foreground mt-1">
          {{ comments.length }}
          {{ comments.length === 1 ? "comment" : "comments" }}
        </p>
        <p v-else class="text-sm text-muted-foreground mt-1">
          No comments yet. Be the first to comment!
        </p>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="space-y-3"
      >
        <!-- Main Comment -->
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <UserIcon class="h-5 w-5 text-primary" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold text-sm">
                    {{ getDisplayName(comment) }}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(comment.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-foreground whitespace-pre-wrap mb-3">
                  {{ comment.comment }}
                </p>
                <button
                  v-if="isAuthenticated"
                  @click="handleReply(comment.id)"
                  class="text-xs text-primary hover:underline font-medium"
                >
                  Reply
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Replies -->
        <div
          v-if="comment.replies && comment.replies.length > 0"
          class="ml-14 space-y-3 border-l-2 border-border pl-4"
        >
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="space-y-2"
          >
            <Card>
              <CardContent class="pt-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <div
                      class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <UserIcon class="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-semibold text-xs">
                        {{ getDisplayName(reply) }}
                      </span>
                      <span class="text-xs text-muted-foreground">
                        {{ formatDate(reply.createdAt) }}
                      </span>
                    </div>
                    <p class="text-sm text-foreground whitespace-pre-wrap">
                      {{ reply.comment }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <Card v-else>
      <CardContent class="py-8 text-center">
        <MessageSquare class="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p class="text-muted-foreground mb-4">
          No comments yet. Be the first to share your thoughts!
        </p>
        <!-- Show Login/Signup buttons for non-authenticated users -->
        <div v-if="!isAuthenticated" class="flex justify-center gap-2">
          <Button as-child>
            <NuxtLink
              :to="{
                path: '/login',
                query: {
                  redirect: route.fullPath,
                },
              }"
            >
              Login
            </NuxtLink>
          </Button>
          <Button as-child variant="outline">
            <NuxtLink
              :to="{
                path: '/signup',
                query: {
                  redirect: route.fullPath,
                },
              }"
            >
              Sign Up
            </NuxtLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
