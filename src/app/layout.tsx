import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { NavbarErrorBoundary } from "@/components/navbar-error-boundary";
import { SupabaseStatus } from "@/components/SupabaseStatus";
import { SafeBoundary } from "@/components/safe-boundary";

export const metadata: Metadata = {
  title: "Run It — Run your own games.",
  description: "Create and join baseball & softball tournaments. Pay, play, win.",
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
        <NavbarErrorBoundary>
          <Navbar />
        </NavbarErrorBoundary>
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <footer className="border-t border-border bg-surface py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted">
            <p className="font-semibold text-foreground">Run It</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} Run It. Run your own games.</p>
            <div className="mt-2"><SafeBoundary><SupabaseStatus /></SafeBoundary></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
