import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summer Baseball Team Listings | Open Roster Spots",
  description:
    "Browse summer baseball team listings and open roster spots. Find summer collegiate baseball leagues and teams looking for players. CG Recruiting connects teams with college talent.",
  keywords: [
    "summer baseball team listings",
    "summer baseball roster spots",
    "summer collegiate baseball leagues",
    "summer baseball opportunities",
    "find summer baseball team",
    "baseball team openings",
    "CG Recruiting listings",
    "summer ball team directory",
  ],
  openGraph: {
    title: "Summer Baseball Team Listings | CG Recruiting and Development",
    description:
      "Browse open roster spots and summer team listings. Find your next summer baseball opportunity.",
    url: "https://cg-recruiting.vercel.app/listings",
  },
};

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
