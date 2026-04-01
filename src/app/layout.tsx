import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tanzaniawildlifetrappers.com"),
  title: {
    default: "Tanzania Wildlife Trappers",
    template: "%s | Tanzania Wildlife Trappers",
  },
  description:
    "Legal and humane wildlife capture, relocation, veterinary support, and field training services across Tanzania and East Africa.",
  keywords: [
    "Tanzania wildlife trappers",
    "wildlife capture Tanzania",
    "wildlife relocation East Africa",
    "wildlife veterinary services Tanzania",
    "human wildlife conflict response",
    "TAWA wildlife services",
    "TANAPA wildlife management",
  ],
  openGraph: {
    title: "Tanzania Wildlife Trappers",
    description:
      "Safe, legal, and ethical wildlife management services for conservation authorities, parks, reserves, and private partners.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
