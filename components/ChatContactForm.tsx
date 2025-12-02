"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

// Zod schema for form validation
const chatFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(
      /^(\+?27|0)[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/,
      "Please enter a valid South African phone number"
    ),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  message: z.string().min(10, "Please describe your issue (at least 10 characters)").max(500, "Message is too long"),
  // Honeypot field (hidden from users, bots will fill it)
  website: z.string().max(0, "Spam detected").optional(),
});

type ChatFormData = z.infer<typeof chatFormSchema>;

interface ChatContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChatContactForm({ onSuccess, onCancel }: ChatContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChatFormData>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: ChatFormData) => {
    // Check honeypot field
    if (data.website && data.website.length > 0) {
      // This is a bot - silently fail
      console.log("Spam detected via honeypot");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to submit form");
      }

      setSubmitSuccess(true);
      reset();
      
      // Wait a moment to show success message, then call onSuccess
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-gray-900">Connect with a Person</h4>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close form"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          {...register("website")}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div>
          <label htmlFor="chat-name" className="text-xs font-medium text-gray-700 block mb-1">
            Name *
          </label>
          <Input
            id="chat-name"
            type="text"
            {...register("name")}
            className="h-9 text-sm"
            disabled={isSubmitting}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="mt-0.5 text-xs text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="chat-phone" className="text-xs font-medium text-gray-700 block mb-1">
            Phone Number *
          </label>
          <Input
            id="chat-phone"
            type="tel"
            {...register("phone")}
            className="h-9 text-sm"
            placeholder="082 555 1234"
            disabled={isSubmitting}
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone && (
            <p className="mt-0.5 text-xs text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="chat-email" className="text-xs font-medium text-gray-700 block mb-1">
            Email (Optional)
          </label>
          <Input
            id="chat-email"
            type="email"
            {...register("email")}
            className="h-9 text-sm"
            disabled={isSubmitting}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="mt-0.5 text-xs text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="chat-message" className="text-xs font-medium text-gray-700 block mb-1">
            Describe Your Issue *
          </label>
          <textarea
            id="chat-message"
            {...register("message")}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            disabled={isSubmitting}
            aria-invalid={errors.message ? "true" : "false"}
          />
          {errors.message && (
            <p className="mt-0.5 text-xs text-red-600" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {submitError && (
          <div className="rounded-md bg-red-50 p-2 text-xs text-red-800" role="alert">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="rounded-md bg-green-50 p-2 text-xs text-green-800" role="alert">
            ✅ Thank you! We&apos;ve received your information. David will contact you within 30 minutes.
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 h-9 text-xs"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            size="sm"
            className="flex-1 h-9 text-xs" 
            disabled={isSubmitting || submitSuccess}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : submitSuccess ? (
              "Submitted ✓"
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

