import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  description: string;
  priceRange: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  title,
  description,
  priceRange,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <Card className={`h-full card-hover border ${popular ? "border-[#DC2626] shadow-lg ring-2 ring-[#DC2626]/20" : "border-[#E5E7EB]"}`}>
      {popular && (
        <div className="bg-[#DC2626] text-white text-center py-2 text-sm font-semibold font-accent">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-[#1F2937]">{title}</CardTitle>
        <CardDescription className="text-[#6B7280]">{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold text-[#DC2626]">{priceRange}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#1F2937]">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="w-full font-accent" variant={popular ? "default" : "outline"}>
          <Link href="/contact">Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

