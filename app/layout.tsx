import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PipeWorks - Professional Plumbing Services",
  description: "Expert plumbing services in Johannesburg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

