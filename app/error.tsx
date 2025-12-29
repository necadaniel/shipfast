"use client";

import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import config from "@/config";

// A simple error boundary to show a nice error page if something goes wrong (Error Boundary)
// Users can contact support, go to the main page or try to reset/refresh to fix the error
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background p-6">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      {/* Gradient orbs for ambient effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse corner-squircle" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/20 rounded-full blur-[128px] animate-pulse delay-1000 corner-squircle" />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        {/* Error icon card */}
        <div className="w-32 h-32 rounded-2xl corner-squircle bg-gradient-to-b from-destructive/20 via-destructive/10 to-destructive/5 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(220,38,38,0.15)]">
          <AlertTriangle className="w-16 h-16 text-destructive" />
        </div>

        {/* Error message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>
          {error?.message && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 max-w-xl corner-squircle">
              <p className="text-sm font-mono text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            onClick={reset}
            size="lg"
            className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.16)] transition-all hover:translate-y-[-1px]"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.12)] transition-all hover:translate-y-[-1px]"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Help section */}
        <div className="pt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Need help?</span>
          <Link
            href={`mailto:${
              config.resend?.supportEmail || "support@changeme.com"
            }`}
            className="text-primary hover:underline font-medium"
          >
            Contact Support
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="pt-4 flex flex-wrap gap-3 justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/privacy-policy">Privacy</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
