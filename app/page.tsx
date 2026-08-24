import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesGrid from "@/components/FeaturesGrid";
import WithWithout from "@/components/WithWithout";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({ canonicalUrlRelative: "/" });

// Your landing page. Delete the sections you don't need and reorder the rest —
// each one is a self-contained component in /components.
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <FeaturesGrid />
        <WithWithout />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
