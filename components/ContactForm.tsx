"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(
      /^(\+?27|0)[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/,
      "Please enter a valid South African phone number (e.g., 082 555 1234)"
    ),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message is too long"),
  // Honeypot field (hidden from users, bots will fill it)
  website: z.string().max(0, "Spam detected").optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Check honeypot field
    if (data.website && data.website.length > 0) {
      // This is a bot - silently fail
      console.log("Spam detected via honeypot");
      setSubmitSuccess(true); // Fake success to fool bot
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

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
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again or use the chat widget."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label htmlFor="name" className="text-sm font-medium">
              Name *
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className="mt-1"
              disabled={isSubmitting}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number *
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="mt-1"
              placeholder="082 555 1234"
              disabled={isSubmitting}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email (Optional)
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1"
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium">
              Message *
            </label>
            <textarea
              id="message"
              {...register("message")}
              rows={5}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800" role="alert">
              Thank you! We&apos;ve received your message. David will contact you within 30 minutes.
            </div>
          )}

          <Button type="submit" className="w-full min-h-[44px]" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Or use our chat widget for instant assistance!
          </p>
        </form>
      </CardContent>
    </Card>
  );
}


