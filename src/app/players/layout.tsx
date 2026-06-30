import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse College Baseball Players | Summer Ball Recruiting",
  description:
    "Browse available college baseball players looking for summer ball opportunities. Search by position, program, graduation year, and availability. CG Recruiting connects players with summer teams.",
  keywords: [
    "college baseball players",
    "summer baseball players available",
    "college baseball recruiting",
    "find summer baseball players",
    "baseball player profiles",
    "summer ball player search",
    "CG Recruiting players",
    "college athlete directory",
  ],
  openGraph: {
    title: "Browse College Baseball Players | CG Recruiting and Development",
    description:
      "Find available college baseball players for your summer roster. Filter by position, program, and availability dates.",
    url: "https://cg-recruiting.vercel.app/players",
  },
};

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
