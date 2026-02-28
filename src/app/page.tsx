import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { WhatYouGet } from "@/components/marketing/what-you-get";
import { Pricing } from "@/components/marketing/pricing";
import { WhoIsItFor } from "@/components/marketing/who-is-it-for";
import { FounderMessage } from "@/components/marketing/founder-message";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <WhatYouGet />
        <Pricing />
        <WhoIsItFor />
        <FounderMessage />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
