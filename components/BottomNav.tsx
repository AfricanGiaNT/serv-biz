"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, Phone, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useChat } from "@/lib/chat-context";

export function BottomNav() {
  const pathname = usePathname();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { openChat } = useChat();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleCall = () => {
    window.location.href = "tel:+27112345678";
  };

  const handleChat = () => {
    openChat();
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      active: isActive("/"),
    },
    {
      icon: Wrench,
      label: "Services",
      href: "/services",
      active: isActive("/services"),
    },
    {
      icon: Phone,
      label: "Call",
      href: "#",
      action: handleCall,
      active: false,
    },
    {
      icon: MessageCircle,
      label: "Chat",
      href: "#",
      action: handleChat,
      active: false,
    },
  ];

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = item.active;
            
            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors"
                  aria-label={item.label}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isItemActive ? "text-[#DC2626]" : "text-[#6B7280]"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isItemActive ? "text-[#DC2626]" : "text-[#6B7280]"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors"
                aria-label={item.label}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isItemActive ? "text-[#DC2626]" : "text-[#6B7280]"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isItemActive ? "text-[#DC2626]" : "text-[#6B7280]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="flex flex-col items-center justify-center gap-1 min-h-[44px] w-full transition-colors"
              aria-label="More"
            >
              <MoreHorizontal
                className={`h-5 w-5 ${
                  moreMenuOpen ? "text-[#DC2626]" : "text-[#6B7280]"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  moreMenuOpen ? "text-[#DC2626]" : "text-[#6B7280]"
                }`}
              >
                More
              </span>
            </button>

            {/* More Menu Dropdown */}
            {moreMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/about"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F3F4F6] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F3F4F6] transition-colors border-t border-gray-200"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F3F4F6] transition-colors border-t border-gray-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F3F4F6] transition-colors border-t border-gray-200"
                >
                  Terms of Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay to close more menu when clicking outside */}
      {moreMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMoreMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

