import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { ProductShowcase } from "@/components/Landing/ProductShowcase";
import { FeaturesGrid } from "@/components/Landing/FeaturesGrid";
import { Pricing } from "@/components/Landing/Pricing";
import { Footer } from "@/components/Landing/Footer";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>; // Must be a Promise
}) {
  const { locale } = await params; // Must await it

  // This is required for static rendering in next-intl
  setRequestLocale(locale);

  return (
    // The bg-transparent is crucial so the body noise/mesh texture shows through
    <div className="min-h-screen flex flex-col bg-transparent text-foreground selection:bg-primary/30 selection:text-black overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <ProductShowcase />
        <FeaturesGrid />
        <Pricing />
        <Footer />
      </main>
    </div>
  );
}
