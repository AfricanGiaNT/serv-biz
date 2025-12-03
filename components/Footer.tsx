import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">PipeWorks</h3>
            <p className="text-sm text-muted-foreground">
              Professional plumbing services in Johannesburg. We&apos;re here
              to help with all your plumbing needs, 24/7.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <a
                  href="tel:+27112345678"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +27 11 234 5678
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <a
                  href="mailto:info@pipeworks.co.za"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@pipeworks.co.za
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  Johannesburg, South Africa
                </span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p className="text-muted-foreground">8:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Saturday</p>
                  <p className="text-muted-foreground">9:00 AM - 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Sunday & Emergencies</p>
                  <p className="text-muted-foreground">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PipeWorks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}





