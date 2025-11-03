"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Lock,
  Zap,
  Shield,
  Terminal,
  Layers,
  Users,
  CheckCircle2,
  Copy,
  Clock,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "AES-256 encryption. Your secrets never touch our servers unencrypted.",
    styles:
      "md:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
    demo: (
      <div className="relative h-full flex items-center justify-center p-8">
        {/* Encryption visualization */}
        <div className="relative flex items-center gap-8">
          {/* Your device */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_6px_16px_rgba(0,0,0,0.4)] flex items-center justify-center backdrop-blur-sm">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Your Device
            </span>
          </div>

          {/* Encrypted data flow */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative h-1 w-32 bg-primary/20 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
            </div>
            <Badge
              variant="secondary"
              className="text-xs shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_6px_rgba(0,0,0,0.3)]"
            >
              🔒 Encrypted
            </Badge>
          </div>

          {/* Cloud */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_6px_16px_rgba(0,0,0,0.4)] flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Cloud
            </span>
          </div>
        </div>

        {/* Code snippet overlay */}
        <div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-background/90 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_3px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm font-mono text-xs text-muted-foreground">
          <span className="text-primary">AES-256-GCM</span>
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: "Real-Time Sync",
    description: "Update on one device, instantly available everywhere.",
    styles: "bg-gradient-to-br from-background to-accent/20",
    demo: (
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Synced devices */}
          {[
            { name: "MacBook Pro", time: "Just now", icon: "💻" },
            { name: "Windows PC", time: "2s ago", icon: "🖥️" },
            { name: "Ubuntu Server", time: "3s ago", icon: "🐧" },
          ].map((device, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-sm group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_3px_10px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{device.icon}</span>
                <div>
                  <div className="text-sm font-medium">{device.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {device.time}
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Terminal,
    title: "CLI & Web App",
    description: "Powerful CLI for your workflow. Web app for quick edits.",
    styles: "bg-gradient-to-br from-background to-secondary/40",
    demo: (
      <div className="relative h-full flex items-center justify-center px-6">
        {/* Terminal mockup */}
        <div className="w-full max-w-sm rounded-lg bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_6px_20px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/40">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">
              terminal
            </span>
          </div>
          {/* Terminal content */}
          <div className="p-4 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">$</span>
              <span className="text-foreground">envsync pull</span>
            </div>
            <div className="text-green-500">✓ Synced 3 projects</div>
            <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              → my-app (.env.local)
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: "Project Organization",
    description: "Group secrets by project, environment, or client.",
    styles: "md:col-span-2 bg-gradient-to-br from-background to-muted/40",
    demo: (
      <div className="h-full flex items-center justify-center px-6 py-8">
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {[
            {
              name: "my-saas-app",
              envs: 3,
              color: "bg-blue-500/20 text-blue-500",
            },
            {
              name: "client-project",
              envs: 2,
              color: "bg-purple-500/20 text-purple-500",
            },
            {
              name: "mobile-app",
              envs: 4,
              color: "bg-green-500/20 text-green-500",
            },
            {
              name: "api-service",
              envs: 2,
              color: "bg-orange-500/20 text-orange-500",
            },
          ].map((project, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_3px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_4px_12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_6px_16px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${project.color} flex items-center justify-center mb-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <div className="font-mono text-sm font-medium mb-1 truncate">
                {project.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {project.envs} environments
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const FeaturesGrid = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>

          <h2 className="font-bold text-4xl lg:text-5xl tracking-tight mb-6 text-foreground">
            Everything you need to
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              manage secrets safely
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Built for developers who value security, speed, and simplicity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`
                group relative rounded-2xl overflow-hidden
                ${feature.styles}
                shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]
                dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_6px_20px_rgba(0,0,0,0.3)]
                hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_24px_rgba(0,0,0,0.12)]
                dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_10px_32px_rgba(0,0,0,0.4)]
                transition-all duration-300
                ${
                  feature.styles.includes("md:col-span-2")
                    ? "md:col-span-2"
                    : ""
                }
              `}
            >
              {/* Content */}
              <div className="relative z-10 p-6 lg:p-8 flex flex-col h-full min-h-[24rem]">
                {/* Icon & Text */}
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-background/60 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.3)] mb-4 backdrop-blur-sm">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl lg:text-2xl mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>

                {/* Demo */}
                <div className="flex-1">{feature.demo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add shimmer animation to globals.css */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesGrid;
