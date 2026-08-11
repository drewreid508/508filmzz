import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Preloader } from "@/components/chrome/preloader";
import { PageTransition } from "@/components/chrome/page-transition";
import { Cursor } from "@/components/chrome/cursor";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { StickyCta } from "@/components/chrome/sticky-cta";
import { StructuredData } from "@/components/seo/structured-data";
import { Analytics, AnalyticsNoScript } from "@/components/analytics/analytics";
import { robotsMeta } from "@/lib/visibility";
import { site } from "@/data/site";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Automotive & Commercial Video Production`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "automotive videographer",
    "cinematic car films",
    "commercial video production",
    "drone videographer",
    "aerial videography",
    "commercial photography",
    "social media reels",
    "508 Filmzz",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Automotive & Commercial Video Production`,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Automotive & Commercial Video Production`,
    description: site.description,
  },
  robots: robotsMeta,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  /**
   * Search Console verification. Fill NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION once
   * Drew has claimed the property — the meta tag is one of the two accepted
   * methods and is the easier one on Vercel.
   */
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${montserrat.variable}`}>
      <body className="bg-ink text-bone min-h-dvh">
        <AnalyticsNoScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <Preloader />
          <Cursor />
          <Header />
          <PageTransition>
            <main id="main">{children}</main>
            <Footer />
          </PageTransition>
          <StickyCta />
        </SmoothScroll>

        <div className="grain-overlay" aria-hidden="true" />
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
