import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import config from "@/config";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5 dark:to-primary/10">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient orbs for depth */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-center lg:self-start px-4 py-2 rounded-full bg-primary/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Zero-Knowledge Security
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-bold text-5xl lg:text-7xl tracking-tight text-foreground leading-[1.1]">
                Sync Your
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                  Secrets
                </span>
                Effortlessly
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                End-to-end encrypted environment file sync across all your
                devices. Stop sharing secrets via Slack. Start syncing securely.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/60 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AES-256 Encrypted</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/60 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Real-time Sync</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/60 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Zero-Knowledge</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group px-8 text-base">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-base">
                View Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar
                    key={i}
                    className="w-10 h-10 border-2 border-background shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${i}`}
                      alt={`User ${i}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-foreground">
                    2,847
                  </span>
                  <span className="text-sm text-muted-foreground">
                    developers
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  syncing securely
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Card */}
          <div className="relative">
            {/* Floating card with code preview */}
            <div className="relative rounded-2xl bg-gradient-to-br from-background to-accent/20 p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_48px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              {/* Code block mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <span className="text-sm font-mono text-muted-foreground">
                    .env.local
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground/60 select-none">
                      1
                    </span>
                    <code className="text-foreground">
                      <span className="text-primary">DATABASE_URL</span>=
                      <span className="text-muted-foreground">
                        mongodb://...
                      </span>
                    </code>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground/60 select-none">
                      2
                    </span>
                    <code className="text-foreground">
                      <span className="text-primary">API_KEY</span>=
                      <span className="text-muted-foreground">sk_live_...</span>
                    </code>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground/60 select-none">
                      3
                    </span>
                    <code className="text-foreground">
                      <span className="text-primary">JWT_SECRET</span>=
                      <span className="text-muted-foreground">
                        super_secret_...
                      </span>
                    </code>
                  </div>
                </div>

                {/* Sync indicator */}
                <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                  <CheckCircle2 className="w-4 h-4 text-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Synced across 3 devices • Encrypted
                  </span>
                </div>
              </div>

              {/* Floating device badges */}
              <div className="absolute -right-4 -top-4 px-4 py-2 rounded-lg bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_6px_16px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium">Live Sync</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-50" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
