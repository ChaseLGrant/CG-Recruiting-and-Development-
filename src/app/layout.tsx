import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { NavbarErrorBoundary } from "@/components/navbar-error-boundary";

export const metadata: Metadata = {
  title: "Summer Ball Portal",
  description: "Connect college players with summer baseball opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
            &copy; {new Date().getFullYear()} Summer Ball Portal. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
