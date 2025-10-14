import Link from "next/link";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import config from "@/config";

// Modern 404 page matching the app's design language
export default function Custom404() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center p-6 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Icon */}
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.12)] mb-4">
          <AlertCircle className="w-16 h-16 text-primary" />
        </div>
        {/* Error Code */}
        <div>
          <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to
            another location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/">
            <Button
              size="lg"
              className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(0,0,0,0.2)] hover:translate-y-[-1px] transition-all"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(0,0,0,0.12)] hover:translate-y-[-1px] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50 text-sm text-muted-foreground">
            <span>Need help?</span>
            <Link
              href="mailto:support@envsync.com"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Or explore these pages:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
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
