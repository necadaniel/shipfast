import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import ButtonSignin from "./ButtonSignin";

const Hero = () => {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
      <div className="space-y-8 text-center lg:text-left">
        <div className="border-border bg-muted/40 text-muted-foreground inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
          SaaS starter kit for fast launches
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Ship your startup in days, not weeks
        </h1>

        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          The Next.js starter with auth, payments, and production-grade UI.
          Start shipping features now instead of rebuilding the same foundation.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <ButtonSignin text={`Get ${config.appName}`} />
        </div>

        <TestimonialsAvatars priority />
      </div>

      <div className="border-border bg-muted/20 relative overflow-hidden rounded-2xl border p-2 shadow-xl">
        <Image
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
          alt="Product demo"
          className="h-full w-full rounded-xl object-cover"
          priority
          width={900}
          height={640}
        />
      </div>
    </section>
  );
};

export default Hero;
