import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { ProductShowcase } from "@/components/Landing/ProductShowcase";
import { FeaturesGrid } from "@/components/Landing/FeaturesGrid";
import { Pricing } from "@/components/Landing/Pricing";
import { Footer } from "@/components/Landing/Footer";

export default function Home() {
  return (
    // The bg-transparent is crucial so the body noise/mesh texture shows through
    <div className="min-h-screen flex flex-col bg-transparent text-foreground selection:bg-primary/30 selection:text-black overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <ProductShowcase />
        <FeaturesGrid />
        <Pricing/>
        <Footer/>
        {/* Placeholder for Next Steps */}
        <section className="h-[50vh] flex items-center justify-center text-muted-foreground/40">
          ... Features Section Loading ...
        </section>
      </main>
    </div>
  );
}
