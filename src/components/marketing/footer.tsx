import Link from "next/link";

const links = {
  product: [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#what-you-get", label: "What You Get" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#who-is-it-for", label: "Who It&apos;s For" },
  ],
  company: [
    { href: "/#faq", label: "FAQ" },
    { href: "/apply", label: "Apply Now" },
    { href: "mailto:hello@founderlaunchweb.com", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white font-black text-sm">
                FL
              </div>
              <span className="text-white font-black tracking-tight text-lg uppercase">
                Founder<span className="text-[var(--color-accent)]">Launch</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-sm mb-6">
              Helping aspiring entrepreneurs go from idea to fully launched online business in 30 days.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] transition-all duration-200"
            >
              Apply Now →
            </Link>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-border)] py-6">
          <p className="text-xs text-[var(--color-muted)]">
            &copy; {new Date().getFullYear()} Founder Launch. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="#"
              className="text-xs text-[var(--color-muted)] hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-[var(--color-muted)] hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
