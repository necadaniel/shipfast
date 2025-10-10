"use client";

import { useState, useEffect } from "react";
import type { JSX } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";
import { ThemeToggle } from "./ThemeToggle";

const links: {
  href: string;
  label: string;
}[] = [
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#testimonials",
    label: "Reviews",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

const cta: JSX.Element = <ButtonSignin extraStyle="btn-primary" />;

// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-[0_1px_0_0_rgba(255,255,255,0.05),0_2px_8px_-2px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03),0_2px_12px_-2px_rgba(0,0,0,0.4)]">
      <nav
        className="container flex items-center justify-between px-6 lg:px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Your logo/name on large screens */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-2.5 shrink-0 group"
            href="/"
            title={`${config.appName} homepage`}
          >
            <div className="relative p-1 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_8px_rgba(99,102,241,0.2)] dark:group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_2px_12px_rgba(99,102,241,0.3)]">
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-7 h-7"
                placeholder="blur"
                priority={true}
                width={28}
                height={28}
              />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              {config.appName}
            </span>
          </Link>
        </div>

        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-lg">
                <span className="sr-only">Open main menu</span>
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-sm bg-background"
            >
              {/* Your logo/name on small screens */}
              <div className="flex items-center justify-between mb-8">
                <Link
                  className="flex items-center gap-2.5 shrink-0 group"
                  title={`${config.appName} homepage`}
                  href="/"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative p-1 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                    <Image
                      src={logo}
                      alt={`${config.appName} logo`}
                      className="w-7 h-7"
                      placeholder="blur"
                      priority={true}
                      width={28}
                      height={28}
                    />
                  </div>
                  <span className="font-bold text-lg text-foreground tracking-tight">
                    {config.appName}
                  </span>
                </Link>
              </div>

              {/* Your links on small screens */}
              <div className="flex flex-col gap-y-2 items-start mb-8">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 w-full py-3 px-4 rounded-lg"
                    title={link.label}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Separator className="mb-8 bg-border/40" />

              {/* Your CTA on small screens */}
              <div className="flex flex-col">{cta}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Your links on large screens */}
        <div className="hidden lg:flex lg:justify-center lg:gap-8 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full pb-1"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1 gap-2">
          <ThemeToggle />
          {cta}
        </div>
      </nav>
    </header>
  );
};

export default Header;
