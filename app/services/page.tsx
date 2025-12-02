"use client";

import { ServiceCard } from "@/components/ServiceCard";
import {
  Wrench,
  Droplet,
  Thermometer,
  Zap,
  Shield,
  Gauge,
  Home,
  Toilet,
} from "lucide-react";

export default function ServicesPage() {
  const allServices = [
    {
      icon: Droplet,
      title: "Leak Repairs",
      description:
        "Fast and reliable leak detection and repair services for all plumbing fixtures. We use advanced detection equipment to locate hidden leaks and fix them quickly.",
      priceRange: "R500 - R2,500",
    },
    {
      icon: Thermometer,
      title: "Geyser Services",
      description:
        "Complete geyser solutions including installation, repair, replacement, and maintenance. We work with all major brands and provide warranties on all work.",
      priceRange: "R800 - R5,000",
    },
    {
      icon: Wrench,
      title: "Blocked Drains",
      description:
        "Professional drain cleaning and unblocking services using high-pressure water jetting and drain snakes. We handle all types of blockages.",
      priceRange: "R400 - R1,500",
    },
    {
      icon: Zap,
      title: "Emergency Plumbing",
      description:
        "24/7 emergency response for urgent plumbing issues including burst pipes, flooding, and no hot water. Fast response times across Johannesburg.",
      priceRange: "R600 - R3,000",
    },
    {
      icon: Shield,
      title: "Bathroom Renovations",
      description:
        "Complete bathroom plumbing installations and renovations. From design to completion, we handle all plumbing aspects of your bathroom project.",
      priceRange: "R5,000 - R25,000",
    },
    {
      icon: Gauge,
      title: "Pipe Installation & Repair",
      description:
        "New pipe installations, pipe repairs, and pipe replacement services. We work with copper, PVC, and PEX piping systems.",
      priceRange: "R800 - R4,000",
    },
    {
      icon: Home,
      title: "Kitchen Plumbing",
      description:
        "Kitchen sink installations, dishwasher connections, garbage disposal installation, and all kitchen plumbing needs.",
      priceRange: "R600 - R3,500",
    },
    {
      icon: Toilet,
      title: "Toilet Repairs",
      description:
        "Toilet installation, repair, and replacement services. We fix running toilets, blocked toilets, and handle complete toilet replacements.",
      priceRange: "R400 - R2,500",
    },
    {
      icon: Droplet,
      title: "Water Heater Services",
      description:
        "Installation, repair, and maintenance of all types of water heaters including solar, gas, and electric systems.",
      priceRange: "R1,200 - R6,000",
    },
  ];

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Our Plumbing Services
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive plumbing solutions for residential and commercial properties in
          Johannesburg
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Something Else?</h2>
        <p className="text-muted-foreground mb-6">
          We handle all types of plumbing work. Contact us to discuss your specific needs.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
        >
          Get a Free Quote
        </a>
      </div>
    </div>
  );
}

