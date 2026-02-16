"use client";

import { ChevronDown, Gift, GraduationCap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const items = [
  {
    title: "Get Started",
    description: "Quick setup checklist to launch faster.",
    icon: Rocket,
  },
  {
    title: "Rewards",
    description: "Customer perks and engagement ideas.",
    icon: Gift,
  },
  {
    title: "Academics",
    description: "Learning resources for your team.",
    icon: GraduationCap,
  },
];

const ButtonPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          Popover Button
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[26rem] p-2">
        <div className="grid gap-1">
          {items.map((item) => (
            <button
              key={item.title}
              type="button"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40">
                <item.icon className="size-5 text-primary" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonPopover;
