import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Clock, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            About PipeWorks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted plumbing partner in Johannesburg
          </p>
        </div>

        {/* Business Story */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              PipeWorks was founded with a simple mission: to provide reliable, professional
              plumbing services to the people of Johannesburg. We understand that plumbing
              problems don&apos;t wait for convenient times, which is why we offer 24/7 emergency
              services.
            </p>
            <p className="text-muted-foreground mb-4">
              Our team, led by David, consists of experienced, licensed plumbers who take pride in
              their work. We believe in transparent pricing, honest communication, and quality
              craftsmanship that stands the test of time.
            </p>
            <p className="text-muted-foreground">
              Whether it&apos;s a simple leak repair or a complete bathroom renovation, we treat
              every job with the same level of professionalism and care. Your satisfaction is our
              priority.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>David - Founder & Lead Plumber</CardTitle>
                <CardDescription>15+ years of experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  David started PipeWorks with a vision to provide honest, reliable plumbing
                  services. With over 15 years of experience in the industry, he leads our team
                  with expertise and dedication.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Our Expert Plumbers</CardTitle>
                <CardDescription>Licensed & Insured</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our team of skilled plumbers are all licensed, insured, and continuously trained
                  on the latest techniques and technologies. We work together to ensure every job
                  is completed to the highest standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Service Area</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Johannesburg & Surrounding Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We proudly serve the greater Johannesburg area, including:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {[
                  "Sandton",
                  "Rosebank",
                  "Parktown",
                  "Soweto",
                  "Alexandra",
                  "Midrand",
                  "Randburg",
                  "Bryanston",
                  "And more...",
                ].map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Not sure if we service your area? Contact us and we&apos;ll let you know!
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quality Workmanship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We never cut corners. Every job is completed to the highest standards with
                  quality materials and expert craftsmanship.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mb-2" />
                <CardTitle>24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Plumbing emergencies don&apos;t wait. We&apos;re available around the clock to
                  help when you need us most.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Transparent Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No hidden fees or surprises. We provide clear, upfront pricing before starting
                  any work.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Licensed & Insured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our plumbers are fully licensed and insured, giving you peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-lg border bg-primary text-primary-foreground p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="mb-6 opacity-90">
            Get in touch today for a free, no-obligation quote on your plumbing needs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 min-h-[44px]"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}



