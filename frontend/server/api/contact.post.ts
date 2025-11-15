import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default defineEventHandler(async (event) => {
  assertMethod(event, "POST");

  try {
    const body = await readBody(event);
    const validatedData = contactFormSchema.parse(body);
    const config = useRuntimeConfig();

    if (config.public.strapiUrl) {
      try {
        await $fetch(`${config.public.strapiUrl}/api/contact-submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(config.public.strapiApiToken
              ? { Authorization: `Bearer ${config.public.strapiApiToken}` }
              : {}),
          },
          body: {
            data: {
              name: validatedData.name.trim(),
              email: validatedData.email.trim(),
              phone: validatedData.phone?.trim() || null,
              message: validatedData.message.trim(),
              read: false,
            },
          },
        });
      } catch (strapiError: any) {
        console.error("Failed to save submission to Strapi:", strapiError);
      }
    }

    if (process.dev) {
      console.log("Contact form submission:", validatedData);
    }

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const issues = zodError.issues || [];

      if (issues.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: "Validation failed",
          data: {
            errors: issues.map((err) => ({
              field: Array.isArray(err.path)
                ? err.path.join(".")
                : String(err.path || "unknown"),
              message: err.message || "Invalid value",
            })),
          },
        });
      }
    }

    if (error?.issues && Array.isArray(error.issues)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: {
          errors: error.issues.map((err: any) => ({
            field: Array.isArray(err.path)
              ? err.path.join(".")
              : String(err.path || "unknown"),
            message: err.message || "Invalid value",
          })),
        },
      });
    }

    console.error("Contact form error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        error?.message || "Failed to send message. Please try again later.",
    });
  }
});
