"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Screenshots } from "@/components/Screenshots";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      // TODO: Connect to Supabase waitlist table
    }
  };

  return (
    <main className="min-h-screen grid-pattern">
      <Navbar />
      <Hero
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        onSubmit={handleWaitlist}
      />
      <Features />
      <HowItWorks />
      <Screenshots />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        onSubmit={handleWaitlist}
      />
      <Footer />
    </main>
  );
}
