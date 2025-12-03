import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
            <CardDescription>Please read these terms carefully before using our services</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using PipeWorks&apos; website and services, you accept and agree to
                be bound by these Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Services</h2>
              <p className="text-muted-foreground">
                PipeWorks provides professional plumbing services in Johannesburg and surrounding
                areas. We offer:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Emergency plumbing services (24/7)</li>
                <li>General plumbing repairs and installations</li>
                <li>Geyser services</li>
                <li>Drain cleaning and unblocking</li>
                <li>Bathroom and kitchen plumbing</li>
                <li>Other plumbing-related services as agreed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Quotes and Pricing</h2>
              <p className="text-muted-foreground">
                All quotes provided are estimates based on the information provided. Final pricing
                may vary based on the actual scope of work required. We provide transparent pricing
                and will discuss any changes before proceeding with additional work.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
              <p className="text-muted-foreground mb-2">Payment terms are as follows:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Payment is due upon completion of work unless otherwise agreed</li>
                <li>We accept cash, EFT, and card payments</li>
                <li>For larger projects, a deposit may be required</li>
                <li>Late payment may incur additional charges</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Warranties</h2>
              <p className="text-muted-foreground">
                We provide warranties on our workmanship as specified for each service. Warranty
                periods vary by service type. Materials may have separate manufacturer warranties.
                Warranty does not cover damage caused by misuse, neglect, or unauthorized repairs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                PipeWorks shall not be liable for any indirect, incidental, special, or
                consequential damages arising from the use of our services. Our liability is
                limited to the value of the work performed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Service Area</h2>
              <p className="text-muted-foreground">
                Our primary service area is Johannesburg and surrounding areas. Service outside this
                area may incur additional travel charges or may not be available. Please contact us
                to confirm service availability in your area.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Emergency Services</h2>
              <p className="text-muted-foreground">
                Emergency services are available 24/7. Emergency callout fees may apply outside
                normal business hours. Response times may vary based on location and current demand.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Cancellation Policy</h2>
              <p className="text-muted-foreground">
                If you need to cancel or reschedule an appointment, please provide at least 24 hours
                notice. Late cancellations or no-shows may incur a cancellation fee.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, and images, is the
                property of PipeWorks and is protected by copyright and other intellectual property
                laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting. Continued use of our services after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by the laws of South Africa. Any disputes will be subject
                to the jurisdiction of South African courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> info@pipeworks.co.za
                </p>
                <p>
                  <strong>Phone:</strong> +27 11 234 5678
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





