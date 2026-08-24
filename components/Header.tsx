"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";
import { cn } from "@/lib/utils";

const links: { href: string; label: string }[] = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          className="flex items-center gap-2"
          href="/"
          title={`${config.appName} homepage`}
        >
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="size-8"
            priority
            width={32}
            height={32}
          />
          <span className="text-lg font-extrabold tracking-tight">
            {config.appName}
          </span>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex">
          <ButtonSignin />
        </div>

        <button
          type="button"
          className="border-border inline-flex items-center justify-center rounded-lg border p-2 lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <Menu className="size-5" />
        </button>
      </nav>

      <div
        className={cn(
          "bg-background/80 fixed inset-0 z-50 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          "border-border bg-background fixed inset-y-0 right-0 z-50 w-full max-w-xs border-l p-6 shadow-xl transition-transform lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link
            className="flex items-center gap-2"
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="size-8"
              priority
              width={32}
              height={32}
            />
            <span className="text-lg font-extrabold tracking-tight">
              {config.appName}
            </span>
          </Link>
          <button
            type="button"
            className="border-border inline-flex items-center justify-center rounded-lg border p-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ButtonSignin extraStyle="w-full" />
      </aside>
    </header>
  );
};

export default Header;
