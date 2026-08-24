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
    <section className="from-background via-muted/20 to-background relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b p-6">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:24px_24px] opacity-20" />

      {/* Gradient orbs for ambient effect */}
      <div className="bg-primary/30 corner-squircle absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-[128px]" />
      <div className="bg-destructive/20 corner-squircle absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-[128px] delay-1000" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center space-y-8 text-center">
        {/* Error icon card */}
        <div className="corner-squircle from-destructive/20 via-destructive/10 to-destructive/5 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-b shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(220,38,38,0.15)]">
          <AlertTriangle className="text-destructive h-16 w-16" />
        </div>

        {/* Error message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold md:text-5xl">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-lg">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>
          {error?.message && (
            <div className="bg-destructive/10 border-destructive/20 corner-squircle mt-4 max-w-xl rounded-lg border p-4">
              <p className="text-destructive font-mono text-sm break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button
            onClick={reset}
            size="lg"
            className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.12)] transition-all hover:translate-y-[-1px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.16)]"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)] transition-all hover:translate-y-[-1px] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.12)]"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Help section */}
        <div className="text-muted-foreground flex items-center gap-2 pt-8 text-sm">
          <span>Need help?</span>
          <Link
            href={`mailto:${config.resend.supportEmail}`}
            className="text-primary font-medium hover:underline"
          >
            Contact Support
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
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
