import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://founderlaunchweb.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Launch Your Online Business | Founder Launch",
    template: "%s | Founder Launch",
  },
  description:
    "Go from idea to fully launched online business in 30 days. We build your brand, website, and launch plan — so you can focus on winning. Starting at $3,000.",
  keywords: [
    "launch online business",
    "business launch service",
    "entrepreneur coaching",
    "startup launch",
    "brand building",
    "founder launch",
    "launch in 30 days",
    "online business setup",
    "business for founders",
    "creator business launch",
  ],
  authors: [{ name: "Founder Launch" }],
  creator: "Founder Launch",
  publisher: "Founder Launch",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Founder Launch",
    title: "Launch Your Online Business in 30 Days | Founder Launch",
    description:
      "We build your brand, website, and launch plan — so you can focus on winning. Idea → launched business in 30 days for $3,000.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Founder Launch — Launch Your Business in 30 Days",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Your Online Business in 30 Days | Founder Launch",
    description:
      "We build your brand, website, and launch plan — so you can focus on winning. Idea → launched business in 30 days.",
    images: ["/og-image.png"],
    creator: "@founderlaunchweb",
  },
  verification: {
    google: "",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Founder Launch",
              url: siteUrl,
              description:
                "Founder Launch helps aspiring entrepreneurs go from idea to fully launched online business in 30 days.",
              offers: {
                "@type": "Offer",
                name: "Founder Launch Package",
                description:
                  "Complete done-for-you business launch: brand, website, launch plan, and more.",
                price: "3000",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
