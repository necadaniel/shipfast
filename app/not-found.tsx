import Link from "next/link";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import config from "@/config";

// Modern 404 page matching the app's design language
export default function Custom404() {
  return (
    <section className="from-background via-muted/20 to-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b p-6">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient Orbs */}
      <div className="bg-primary/20 corner-squircle absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full blur-3xl" />
      <div className="bg-primary/10 corner-squircle absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full blur-3xl [animation-delay:1s]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl space-y-8 text-center">
        {/* 404 Icon */}
        <div className="from-muted/50 via-muted/30 to-muted/50 corner-squircle mb-4 inline-flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.12)]">
          <AlertCircle className="text-primary h-16 w-16" />
        </div>
        {/* Error Code */}
        <div>
          <h1 className="text-primary mb-4 text-8xl font-bold tracking-tight md:text-9xl">
            404
          </h1>
          <h2 className="text-foreground mb-3 text-2xl font-bold md:text-3xl">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to another location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link href="/">
            <Button
              size="lg"
              className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_8px_rgba(0,0,0,0.15)] transition-all hover:translate-y-[-1px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(0,0,0,0.2)]"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:translate-y-[-1px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(0,0,0,0.12)]"
            >
              <ArrowLeft className="h-5 w-5" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-8">
          <div className="bg-muted/30 border-border/50 text-muted-foreground corner-squircle inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <span>Need help?</span>
            <Link
              href={`mailto:${config.resend.supportEmail}`}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4">
          <p className="text-muted-foreground mb-3 text-sm">
            Or explore these pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Button>
            </Link>
            <Link href="/#features">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
