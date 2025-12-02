"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { PricingCard } from "@/components/PricingCard";
import { useChat } from "@/lib/chat-context";
import {
  Wrench,
  Droplet,
  Thermometer,
  Zap,
  Shield,
  Phone,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { openChat } = useChat();
  const services = [
    {
      icon: Droplet,
      title: "Leak Repairs",
      description: "Fast and reliable leak detection and repair services for all plumbing fixtures.",
      priceRange: "R500 - R2,500",
    },
    {
      icon: Thermometer,
      title: "Geyser Services",
      description: "Installation, repair, and maintenance of geysers and hot water systems.",
      priceRange: "R800 - R5,000",
    },
    {
      icon: Wrench,
      title: "Blocked Drains",
      description: "Professional drain cleaning and unblocking services using advanced equipment.",
      priceRange: "R400 - R1,500",
    },
    {
      icon: Zap,
      title: "Emergency Plumbing",
      description: "24/7 emergency response for urgent plumbing issues and burst pipes.",
      priceRange: "R600 - R3,000",
    },
    {
      icon: Shield,
      title: "Bathroom Renovations",
      description: "Complete bathroom plumbing installations and renovations.",
      priceRange: "R5,000 - R25,000",
    },
    {
      icon: Wrench,
      title: "General Plumbing",
      description: "All general plumbing repairs, installations, and maintenance services.",
      priceRange: "R300 - R2,000",
    },
  ];

  const pricingTiers = [
    {
      title: "Basic Service",
      description: "For simple repairs and maintenance",
      priceRange: "R300 - R1,000",
      features: [
        "Basic leak repairs",
        "Drain unblocking",
        "Fixture installations",
        "1-hour response time",
        "6-month warranty",
      ],
    },
    {
      title: "Standard Service",
      description: "Most popular for homeowners",
      priceRange: "R500 - R3,000",
      features: [
        "All basic services",
        "Geyser repairs",
        "Emergency callouts",
        "30-minute response time",
        "12-month warranty",
        "Free quotes",
      ],
      popular: true,
    },
    {
      title: "Premium Service",
      description: "Complete plumbing solutions",
      priceRange: "R1,000 - R25,000",
      features: [
        "All standard services",
        "Bathroom renovations",
        "24/7 priority support",
        "15-minute response time",
        "24-month warranty",
        "Free annual maintenance",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Sandton",
      text: "PipeWorks fixed our geyser emergency on a Sunday evening. Professional, fast, and reasonably priced. Highly recommend!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      location: "Rosebank",
      text: "Great service for our bathroom renovation. The team was clean, efficient, and completed the work on time. Very happy with the results.",
      rating: 5,
    },
    {
      name: "Thabo Mthembu",
      location: "Soweto",
      text: "Had a burst pipe in the middle of the night. PipeWorks responded within 30 minutes and fixed everything. Lifesavers!",
      rating: 5,
    },
    {
      name: "Lisa van der Merwe",
      location: "Parktown",
      text: "Regular maintenance customer here. Always professional, always on time, and the prices are transparent. No surprises!",
      rating: 5,
    },
    {
      name: "David Nkomo",
      location: "Alexandra",
      text: "Fixed our blocked drains quickly and explained everything clearly. Great communication and fair pricing.",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-white py-16 md:py-32">
            <div className="container px-4 max-w-7xl mx-auto">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="font-bold tracking-tight text-[#1F2937]">
                  Emergency Plumbing
                  <span className="text-[#DC2626]"> in Johannesburg</span>
                </h1>
                <p className="mt-6 text-lg text-[#6B7280] sm:text-xl">
                  Fast response. Fair pricing. Available 24/7.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="min-h-[44px] font-accent bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                    <Link href="tel:+27112345678">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="min-h-[44px] font-accent border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
                    onClick={openChat}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with Us
                  </Button>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#DC2626]" />
                    <span>7 Years in Business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#DC2626]" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#DC2626]" />
                    <span>Same-Day Service</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Overview Section */}
          <section className="py-20 md:py-24 bg-white">
            <div className="container px-4 max-w-7xl mx-auto">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-bold tracking-tight text-[#1F2937]">
                  Our Services
                </h2>
                <p className="mt-4 text-lg text-[#6B7280]">
                  Comprehensive plumbing solutions for your home and business
                </p>
              </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

          {/* Pricing Section */}
          <section className="bg-[#F3F4F6] py-20 md:py-24">
            <div className="container px-4 max-w-7xl mx-auto">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-bold tracking-tight text-[#1F2937]">
                  Transparent Pricing
                </h2>
                <p className="mt-4 text-lg text-[#6B7280]">
                  No hidden fees. Get a free quote before we start any work.
                </p>
              </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <PricingCard key={index} {...tier} />
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              *Prices are estimates. Final pricing depends on the scope of work. Contact us for a
              free, no-obligation quote.
            </p>
          </div>
        </div>
      </section>

          {/* Testimonials Section */}
          <section className="py-20 md:py-24 bg-white">
            <div className="container px-4 max-w-7xl mx-auto">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-bold tracking-tight text-[#1F2937]">
                  What Our Customers Say
                </h2>
                <p className="mt-4 text-lg text-[#6B7280]">
                  Trusted by homeowners across Johannesburg
                </p>
              </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* CTA Section */}
          <section className="bg-[#DC2626] text-white py-20 md:py-24">
            <div className="container px-4 max-w-7xl mx-auto">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-bold tracking-tight text-white">
                  Ready to Get Started?
                </h2>
                <p className="mt-4 text-lg opacity-90">
                  Get a free quote today. No obligation, just honest advice and transparent pricing.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" variant="secondary" className="min-h-[44px] font-accent bg-white text-[#DC2626] hover:bg-[#F3F4F6]">
                    <Link href="/contact">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Us Now
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="min-h-[44px] font-accent border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
    </div>
  );
}
