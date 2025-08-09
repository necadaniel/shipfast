"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Menu, ChevronDown } from "lucide-react";
import logo from "@/app/icon.png";
import config from "@/config";
import { categories } from "../content";
import ButtonSignin from "@/components/ButtonSignin";

const links: {
  href: string;
  label: string;
}[] = [
  {
    href: "/blog/",
    label: "All Posts",
  },
];

const cta: JSX.Element = (
  <ButtonSignin text="Prevent disputes" extraStyle="btn-primary md:btn-sm" />
);

const ButtonPopoverCategories = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-nowrap items-center gap-1 text-muted-foreground hover:text-foreground focus:text-foreground duration-100 p-0 h-auto font-normal"
        >
          Categories
          <ChevronDown className="w-5 h-5 duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen max-w-full sm:max-w-sm">
        {categories.map((category) => (
          <DropdownMenuItem key={category.slug} asChild>
            <Link
              className="block text-left p-3 cursor-pointer focus:bg-muted rounded-md duration-200"
              href={`/blog/category/${category.slug}`}
            >
              <div>
                <p className="font-medium mb-0.5">
                  {category?.titleShort || category.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {category?.descriptionShort || category.description}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ButtonAccordionCategories = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-between items-center w-full p-0 h-auto font-normal hover:bg-transparent"
        >
          Categories
          <ChevronDown className={`w-5 h-5 duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="space-y-4 mt-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog/category/${category.slug}`}
                className="text-muted-foreground hover:text-foreground duration-100 underline-offset-4 hover:underline"
              >
                {category?.titleShort || category.title}
              </Link>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

// This is the header that appears on all pages in the /blog folder.
// By default it shows the logo, the links, and the CTA.
// In the links, there's a popover with the categories.
const HeaderBlog = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="bg-muted">
      <nav className="max-w-7xl flex items-center justify-between px-8 py-3 mx-auto">
        {/* Your logo/name on large screens */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8"
              priority={true}
              width={32}
              height={32}
            />
            <span className="font-extrabold text-lg text-foreground">{config.appName}</span>
          </Link>
        </div>

        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="-m-2.5 p-2.5">
                <span className="sr-only">Open main menu</span>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              {/* Your logo/name on small screens */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  className="flex items-center gap-2 shrink-0"
                  title={`${config.appName} homepage`}
                  href="/"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src={logo}
                    alt={`${config.appName} logo`}
                    className="w-8"
                    priority={true}
                    width={32}
                    height={32}
                  />
                  <span className="font-extrabold text-lg text-foreground">{config.appName}</span>
                </Link>
              </div>

              {/* Your links on small screens */}
              <div className="flex flex-col gap-y-4 items-start mb-6">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    title={link.label}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <ButtonAccordionCategories />
              </div>

              <Separator className="mb-6" />

              {/* Your CTA on small screens */}
              <div className="flex flex-col">{cta}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Your links on large screens */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-muted-foreground hover:text-foreground focus:text-foreground duration-100 underline-offset-4 hover:underline"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}

          <ButtonPopoverCategories />
        </div>

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>
      </nav>
    </header>
  );
};

export default HeaderBlog;
