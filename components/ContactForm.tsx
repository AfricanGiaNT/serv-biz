"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, MessageSquare, FileText } from "lucide-react";

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
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message is too long"),
  serviceType: z.string().optional(),
  source: z.enum(['WEBSITE_CHAT', 'CONTACT_FORM', 'SERVICES_QUOTE', 'TELEGRAM', 'MANUAL']).optional(),
  image: z
    .custom<FileList>()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true; // No file is okay
      const file = files[0];
      return file.size <= 5 * 1024 * 1024; // 5MB max
    }, "Image must be less than 5MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      return ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
    }, "Only JPEG and PNG images are allowed"),
  // Honeypot field (hidden from users, bots will fill it)
  website: z.string().max(0, "Spam detected").optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
  isQuotation?: boolean;
  defaultServiceType?: string;
  defaultSource?: 'WEBSITE_CHAT' | 'CONTACT_FORM' | 'SERVICES_QUOTE' | 'TELEGRAM' | 'MANUAL';
}

export default function ContactForm({ 
  onSuccess, 
  isQuotation = false, 
  defaultServiceType, 
  defaultSource = 'CONTACT_FORM' 
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      serviceType: defaultServiceType || "",
      source: defaultSource,
      website: "",
    },
  });

  // Watch image field for preview
  const imageField = watch("image");

  // Update preview when image changes
  React.useEffect(() => {
    if (imageField && imageField.length > 0) {
      const file = imageField[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageField]);

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
      // Use FormData for multipart submission
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("message", data.message);
      
      // Add serviceType and source if present
      if (data.serviceType) {
        formData.append("serviceType", data.serviceType);
      }
      if (data.source) {
        formData.append("source", data.source);
      }
      
      // Add image if present
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for multipart
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to submit form");
      }

      setSubmitSuccess(true);
      setImagePreview(null);
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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-[#F97316] to-[#DC2626] px-6 py-8 text-white">
        <div className="flex items-center justify-center gap-3 mb-3">
          {isQuotation ? (
            <FileText className="h-7 w-7" />
          ) : (
            <MessageSquare className="h-7 w-7" />
          )}
          <h2 className="text-2xl font-bold">
            {isQuotation ? 'Request a Quotation' : 'Send Us a Message'}
          </h2>
        </div>
        <p className="text-center text-white/90 text-sm max-w-md mx-auto">
          {isQuotation 
            ? "Fill out the form below with your service requirements and we'll provide you with a detailed quotation within 24 hours."
            : "Fill out the form below and we'll get back to you as soon as possible."}
        </p>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6 bg-gray-50">
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
            <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              👤 Name *
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className="mt-1 bg-white border-gray-300 focus:border-[#F97316] focus:ring-[#F97316]"
              placeholder="John Doe"
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
            <label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              📞 Phone Number *
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="mt-1 bg-white border-gray-300 focus:border-[#F97316] focus:ring-[#F97316]"
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
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              ✉️ Email *
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 bg-white border-gray-300 focus:border-[#F97316] focus:ring-[#F97316]"
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {isQuotation && (
            <div>
              <label htmlFor="serviceType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                🔧 Service Type *
              </label>
              <Input
                id="serviceType"
                type="text"
                {...register("serviceType")}
                className="mt-1 bg-white border-gray-300 focus:border-[#F97316] focus:ring-[#F97316]"
                placeholder="e.g., Leak repair, Geyser installation"
                disabled={isSubmitting}
                aria-invalid={errors.serviceType ? "true" : "false"}
              />
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.serviceType.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                What service are you requesting a quote for?
              </p>
            </div>
          )}

          <div>
            <label htmlFor="image" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              📸 Attach Image (Optional)
            </label>
            <div className="mt-1">
              {imagePreview ? (
                <div className="relative bg-white rounded-lg p-2 border-2 border-gray-300">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="max-h-48 rounded-md mx-auto object-contain"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      const input = document.getElementById("image") as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#F97316] border-dashed rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-[#F97316]" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold text-[#F97316]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG or JPEG (MAX. 5MB)</p>
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    {...register("image")}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.image.message as string}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Upload a photo of the plumbing issue if available
            </p>
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              💬 Message *
            </label>
            <textarea
              id="message"
              {...register("message")}
              rows={5}
              className="mt-1 flex w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              placeholder="Tell us about your plumbing needs..."
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
            <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4 text-sm text-red-800 flex items-start gap-2" role="alert">
              <span className="text-lg">⚠️</span>
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-lg bg-green-50 border-2 border-green-200 p-4 text-sm text-green-800 flex items-start gap-2" role="alert">
              <span className="text-lg">✅</span>
              <span>
                {isQuotation 
                  ? "Thank you! We've received your quotation request. David will send you a detailed quote within 24 hours."
                  : "Thank you! We've received your message. David will contact you within 30 minutes."}
              </span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full min-h-[48px] bg-gradient-to-r from-[#F97316] to-[#DC2626] hover:from-[#EA580C] hover:to-[#B91C1C] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isQuotation ? 'Submitting Request...' : 'Sending...'}
              </>
            ) : (
              <>
                {isQuotation ? '📋 Request Quotation' : '📨 Send Message'}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-600 text-center bg-white rounded-lg py-2 px-3 shadow-sm">
            💬 Or use our chat widget for instant assistance!
          </p>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-[#F97316] to-[#DC2626] px-6 py-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-white font-semibold text-sm">
            Professional Plumbing Services
          </p>
          <p className="text-white/80 text-xs mt-1">
            ⚡ Available 24/7 for emergencies
          </p>
        </div>
      </div>
    </div>
  );
}


