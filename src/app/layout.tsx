import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { NavbarErrorBoundary } from "@/components/navbar-error-boundary";
import { SupabaseStatus } from "@/components/SupabaseStatus";
import { SafeBoundary } from "@/components/safe-boundary";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cgrecruitingbaseball.com"),
  title: {
    default: "CG Recruiting Baseball | Summer Ball Portal for College Players",
    template: "%s | CG Recruiting Baseball",
  },
  description:
    "Connect college baseball players with summer ball opportunities. College coaches post available players; summer teams and leagues find the talent they need. Free to join.",
  keywords: [
    "summer baseball recruiting",
    "college baseball players",
    "summer ball opportunities",
    "baseball recruiting portal",
    "college summer baseball",
    "summer league baseball",
    "baseball roster spots",
    "college baseball coaches",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.cgrecruitingbaseball.com",
    siteName: "CG Recruiting Baseball",
    title: "CG Recruiting Baseball | Summer Ball Portal for College Players",
    description:
      "The marketplace connecting college baseball players, coaches, and summer teams. Post available players, find roster spots, and build your summer roster.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CG Recruiting Baseball - Summer Ball Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CG Recruiting Baseball | Summer Ball Portal",
    description:
      "Connect college baseball players with summer ball opportunities. Free for coaches, teams, and players.",
    images: ["/og-image.png"],
  },
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
  alternates: {
    canonical: "https://www.cgrecruitingbaseball.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18282217102"
        />
        <Script id="google-ads-gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18282217102');`}
        </Script>
        <NavbarErrorBoundary>
          <Navbar />
        </NavbarErrorBoundary>
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <footer className="border-t border-border bg-surface py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} Summer Ball Portal. All rights reserved.</p>
            <div className="mt-2"><SafeBoundary><SupabaseStatus /></SafeBoundary></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
