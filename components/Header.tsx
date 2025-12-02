"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/lib/chat-context";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openChat } = useChat();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl md:text-3xl font-bold text-[#DC2626]">PipeWorks</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#1F2937] transition-colors hover:text-[#DC2626] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DC2626] after:transition-all hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-[#1F2937] transition-colors hover:text-[#DC2626] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DC2626] after:transition-all hover:after:w-full"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#1F2937] transition-colors hover:text-[#DC2626] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DC2626] after:transition-all hover:after:w-full"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[#1F2937] transition-colors hover:text-[#DC2626] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DC2626] after:transition-all hover:after:w-full"
          >
            Contact
          </Link>
          <a
            href="tel:+27112345678"
            className="text-sm font-semibold text-[#1F2937] hover:text-[#DC2626] transition-colors"
          >
            📞 011-234-5678
          </a>
          <Button 
            className="font-accent"
            onClick={openChat}
          >
            Chat Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="w-full">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Get Quote
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

