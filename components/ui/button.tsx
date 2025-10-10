import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground dark:text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_1px_0_0_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_0_0_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] active:translate-y-[0px] active:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_1px_0_0_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_0_0_rgba(0,0,0,0.4),0_6px_12px_rgba(0,0,0,0.4)]",
        destructive:
          "bg-destructive text-white shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_1px_0_0_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_0_0_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] active:translate-y-[0px] dark:bg-destructive/80",
        outline:
          "border border-border bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_1px_2px_rgba(0,0,0,0.05)] hover:bg-accent/50 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_2px_4px_rgba(0,0,0,0.08)] dark:bg-background/50 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_1px_2px_rgba(0,0,0,0.3)] dark:hover:bg-accent/30",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_1px_2px_rgba(0,0,0,0.05)] hover:bg-secondary/80 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_1px_2px_rgba(0,0,0,0.2)]",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/30 transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-11 rounded-lg px-7 has-[>svg]:px-5 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
