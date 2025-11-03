import CTA from "@/components/CTA";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Problem from "@/components/Problem";

export default function Page() {
  return (
    <div>
      <Header />
      <Hero />
      <Problem />
      <FeaturesGrid />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
