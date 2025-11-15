<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-vue-next";

interface Props {
  title?: string;
  submitUrl?: string;
}

const props = defineProps<Props>();

const form = ref({
  name: "",
  email: "",
  phone: "",
  message: "",
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref<string | null>(null);
const fieldErrors = ref<Record<string, string>>({});
const touchedFields = ref<Record<string, boolean>>({});

// Validation rules
const validateField = (field: string, value: string): string => {
  switch (field) {
    case "name":
      if (!value.trim()) {
        return "Name is required";
      }
      if (value.trim().length < 2) {
        return "Name must be at least 2 characters";
      }
      return "";
    case "email":
      if (!value.trim()) {
        return "Email is required";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      return "";
    case "phone":
      // Phone is optional, but if provided, validate format
      if (value.trim() && value.trim().length < 10) {
        return "Please enter a valid phone number";
      }
      return "";
    case "message":
      if (!value.trim()) {
        return "Message is required";
      }
      if (value.trim().length < 10) {
        return "Message must be at least 10 characters";
      }
      return "";
    default:
      return "";
  }
};

// Validate all fields
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};

  Object.keys(form.value).forEach((field) => {
    const error = validateField(
      field,
      form.value[field as keyof typeof form.value]
    );
    if (error) {
      errors[field] = error;
    }
  });

  fieldErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Validate single field
const validateSingleField = (field: string) => {
  const value = form.value[field as keyof typeof form.value];
  const error = validateField(field, value);
  if (error) {
    fieldErrors.value[field] = error;
  } else {
    delete fieldErrors.value[field];
  }
};

// Handle field blur
const handleBlur = (field: string) => {
  touchedFields.value[field] = true;
  validateSingleField(field);
};

// Handle field input
const handleInput = (field: string) => {
  if (touchedFields.value[field]) {
    validateSingleField(field);
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  // Mark all fields as touched
  Object.keys(form.value).forEach((field) => {
    touchedFields.value[field] = true;
  });

  // Validate form before submitting
  if (!validateForm()) {
    // Scroll to first error
    const firstErrorField = Object.keys(fieldErrors.value)[0];
    if (firstErrorField) {
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
    return;
  }

  isSubmitting.value = true;
  submitError.value = null;

  try {
    // Use custom submitUrl if provided, otherwise use default API endpoint
    const submitUrl = props.submitUrl || "/api/contact";

    const response = await $fetch<{ success: boolean; message?: string }>(
      submitUrl,
      {
        method: "POST",
        body: {
          name: form.value.name.trim(),
          email: form.value.email.trim(),
          phone: form.value.phone.trim() || undefined,
          message: form.value.message.trim(),
        },
      }
    );

    if (response.success) {
      submitSuccess.value = true;

      // Reset form
      form.value = {
        name: "",
        email: "",
        phone: "",
        message: "",
      };

      // Reset touched fields and errors
      touchedFields.value = {};
      fieldErrors.value = {};

      // Hide success message after 5 seconds
      setTimeout(() => {
        submitSuccess.value = false;
      }, 5000);
    }
  } catch (error: any) {
    // Handle validation errors
    if (error?.data?.errors && Array.isArray(error.data.errors)) {
      const errors: Record<string, string> = {};
      error.data.errors.forEach((err: { field: string; message: string }) => {
        errors[err.field] = err.message;
        touchedFields.value[err.field] = true;
      });
      fieldErrors.value = errors;
      submitError.value = "Please correct the errors.";

      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }
    } else {
      // Handle other errors
      submitError.value =
        error?.data?.statusMessage ||
        error?.message ||
        "Failed to send message. Please try again later.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="w-full py-16 px-4 bg-muted">
    <div class="max-w-4xl mx-auto">
      <h2
        v-if="title"
        class="text-4xl font-bold text-center mb-12 text-foreground"
      >
        {{ title }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Info -->
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Mail class="h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">info@realestate.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Phone class="h-5 w-5" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <MapPin class="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">
                123 Real Estate St<br />
                City, State 12345
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="name">
                      Name
                      <span class="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      v-model="form.name"
                      type="text"
                      placeholder="Your name"
                      :class="[
                        fieldErrors.name && touchedFields.name
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : touchedFields.name && !fieldErrors.name
                          ? 'border-green-500'
                          : '',
                      ]"
                      @blur="handleBlur('name')"
                      @input="handleInput('name')"
                    />
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 -translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                    >
                      <p
                        v-if="fieldErrors.name && touchedFields.name"
                        class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ fieldErrors.name }}
                      </p>
                    </Transition>
                  </div>
                  <div class="space-y-2">
                    <Label for="email">
                      Email
                      <span class="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="your@email.com"
                      :class="[
                        fieldErrors.email && touchedFields.email
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : touchedFields.email && !fieldErrors.email
                          ? 'border-green-500'
                          : '',
                      ]"
                      @blur="handleBlur('email')"
                      @input="handleInput('email')"
                    />
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 -translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                    >
                      <p
                        v-if="fieldErrors.email && touchedFields.email"
                        class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ fieldErrors.email }}
                      </p>
                    </Transition>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    :class="[
                      fieldErrors.phone && touchedFields.phone
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : touchedFields.phone &&
                          !fieldErrors.phone &&
                          form.phone
                        ? 'border-green-500'
                        : '',
                    ]"
                    @blur="handleBlur('phone')"
                    @input="handleInput('phone')"
                  />
                  <Transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1"
                  >
                    <p
                      v-if="fieldErrors.phone && touchedFields.phone"
                      class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ fieldErrors.phone }}
                    </p>
                  </Transition>
                </div>

                <div class="space-y-2">
                  <Label for="message">
                    Message
                    <span class="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    v-model="form.message"
                    placeholder="Your message..."
                    rows="5"
                    :class="[
                      fieldErrors.message && touchedFields.message
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : touchedFields.message && !fieldErrors.message
                        ? 'border-green-500'
                        : '',
                    ]"
                    @blur="handleBlur('message')"
                    @input="handleInput('message')"
                  />
                  <div class="flex items-start justify-between">
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 -translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                    >
                      <p
                        v-if="fieldErrors.message && touchedFields.message"
                        class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ fieldErrors.message }}
                      </p>
                    </Transition>
                    <p
                      class="text-xs text-muted-foreground ml-auto"
                      :class="
                        form.message.length >= 10
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      "
                    >
                      {{ form.message.length }}/10 characters
                    </p>
                  </div>
                </div>

                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-2"
                >
                  <div
                    v-if="submitSuccess"
                    class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div>
                      <p class="text-green-800 dark:text-green-200 font-medium">
                        Message sent successfully!
                      </p>
                      <p
                        class="text-sm text-green-700 dark:text-green-300 mt-1"
                      >
                        Thank you for contacting us. We'll get back to you as
                        soon as possible.
                      </p>
                    </div>
                  </div>
                </Transition>

                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-2"
                >
                  <div
                    v-if="submitError"
                    class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div>
                      <p class="text-red-800 dark:text-red-200 font-medium">
                        {{ submitError }}
                      </p>
                      <p
                        v-if="Object.keys(fieldErrors).length > 0"
                        class="text-sm text-red-700 dark:text-red-300 mt-1"
                      >
                        Please review the highlighted fields.
                      </p>
                    </div>
                  </div>
                </Transition>

                <Button type="submit" class="w-full" :disabled="isSubmitting">
                  {{ isSubmitting ? "Sending..." : "Send Message" }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
