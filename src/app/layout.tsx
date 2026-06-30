import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { NavbarErrorBoundary } from "@/components/navbar-error-boundary";
import { SupabaseStatus } from "@/components/SupabaseStatus";
import { SafeBoundary } from "@/components/safe-boundary";

export const metadata: Metadata = {
  title: {
    default: "CG Recruiting and Development | Summer College Baseball Recruiting Portal",
    template: "%s | CG Recruiting and Development",
  },
  description:
    "CG Recruiting and Development connects college baseball players with summer ball opportunities. Find summer collegiate baseball leagues, roster spots, and player recruitment tools for coaches and teams.",
  keywords: [
    "CG Recruiting and Development",
    "CG Recruiting",
    "CG baseball recruiting",
    "summer college baseball",
    "summer baseball recruiting",
    "college baseball player portal",
    "summer ball opportunities",
    "summer collegiate baseball league",
    "baseball player recruitment",
    "college baseball roster",
    "summer baseball teams",
    "baseball recruiting platform",
    "college baseball coaches",
    "find summer baseball players",
    "summer ball roster spots",
    "baseball development program",
    "college athlete recruiting",
    "CG Development baseball",
    "summer baseball marketplace",
    "baseball player profiles",
  ],
  authors: [{ name: "CG Recruiting and Development" }],
  creator: "CG Recruiting and Development",
  publisher: "CG Recruiting and Development",
  metadataBase: new URL("https://cg-recruiting.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CG Recruiting and Development",
    title: "CG Recruiting and Development | Summer College Baseball Recruiting",
    description:
      "The #1 platform connecting college baseball players with summer ball opportunities. CG Recruiting helps coaches, teams, and players find their perfect match.",
    url: "https://cg-recruiting.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CG Recruiting and Development | Summer Baseball Recruiting",
    description:
      "Connect college baseball players with summer ball opportunities. Built for coaches, summer teams, and players.",
    creator: "@CGRecruiting",
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
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CG Recruiting and Development",
              alternateName: ["CG Recruiting", "CG Baseball Recruiting", "CG Development"],
              description:
                "CG Recruiting and Development is a summer college baseball recruiting platform connecting players, coaches, and summer teams.",
              url: "https://cg-recruiting.vercel.app",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "English",
              },
              knowsAbout: [
                "Summer collegiate baseball",
                "College baseball recruiting",
                "Baseball player development",
                "Summer baseball leagues",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CG Recruiting and Development",
              alternateName: "CG Recruiting",
              url: "https://cg-recruiting.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://cg-recruiting.vercel.app/players?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        <NavbarErrorBoundary>
          <Navbar />
        </NavbarErrorBoundary>
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <footer className="border-t border-border bg-surface py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} CG Recruiting and Development. All rights reserved.</p>
            <p className="mt-1 text-xs text-muted">Summer college baseball recruiting platform — connecting players, coaches, and teams.</p>
            <div className="mt-2"><SafeBoundary><SupabaseStatus /></SafeBoundary></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
