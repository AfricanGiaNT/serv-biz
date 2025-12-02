"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import DuolingoButton from "@/components/animata/button/duolingo";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priceRange: string;
}

export function ServiceCard({ icon: Icon, title, description, priceRange }: ServiceCardProps) {
  return (
    <Card className="h-full card-hover border border-[#E5E7EB] bg-white flex flex-col">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFF7ED]">
          <Icon className="h-6 w-6 text-[#F97316]" />
        </div>
        <CardTitle className="text-xl text-[#1F2937]">{title}</CardTitle>
        <CardDescription className="mt-2 text-[#6B7280]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-lg font-semibold text-[#DC2626] mb-4">{priceRange}</p>
        <div className="mt-auto">
          <DuolingoButton href="/contact" className="w-auto">
            Enquire Today
          </DuolingoButton>
        </div>
      </CardContent>
    </Card>
  );
}

