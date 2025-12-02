"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a plumbing issue? Need a quote? We&apos;re here to help!
          </p>
        </div>

        {/* Contact Information - Compact Top Section */}
        <div className="mb-8">
          <Card className="border border-[#E5E7EB]">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1F2937]">Phone</p>
                    <a
                      href="tel:+27112345678"
                      className="text-primary hover:underline text-sm"
                    >
                      +27 11 234 5678
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1F2937]">Email</p>
                    <a
                      href="mailto:info@pipeworks.co.za"
                      className="text-primary hover:underline text-sm"
                    >
                      info@pipeworks.co.za
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1F2937]">Service Area</p>
                    <p className="text-muted-foreground text-sm">Johannesburg & Surrounding Areas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}


