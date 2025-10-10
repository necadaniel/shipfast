import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_24px_80px_rgba(0,0,0,0.5)]">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 p-10 lg:p-16">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-bold text-3xl lg:text-5xl tracking-tight mb-6 text-white">
                Ready to secure your secrets?
              </h2>
              <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                Join thousands of developers who trust {config.appName} to keep
                their environment variables safe and synced across all devices.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                  <Lock className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Zero-Knowledge
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Real-time Sync
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    AES-256 Encrypted
                  </span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_6px_20px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all duration-200 group px-8"
                >
                  Get Started Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm px-8"
                >
                  View Demo
                </Button>
              </div>
            </div>

            {/* Right content - Stats */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 lg:gap-8">
              {[
                { value: "2,847", label: "Developers" },
                { value: "50K+", label: "Secrets Synced" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center lg:items-end px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.1)] min-w-[140px]"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom shine effect */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>

        {/* Trust indicators below */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by developers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {/* You can add company logos here */}
            <div className="text-muted-foreground font-semibold">Startups</div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="text-muted-foreground font-semibold">Agencies</div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="text-muted-foreground font-semibold">
              Enterprises
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
