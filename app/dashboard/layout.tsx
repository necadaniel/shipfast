import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/libs/next-auth";
import config from "@/config";
import logo from "@/app/icon.png";
import ButtonAccount from "@/components/ButtonAccount";
import { ThemeToggle } from "@/components/ThemeToggle";
import VersionBadge from "@/components/VersionBadge";

// Server-side auth gate for every page under /dashboard.
// Unauthenticated visitors never see the markup — they're redirected first.
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="bg-muted/20 min-h-screen">
      <header className="border-border bg-background border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="size-7"
              width={28}
              height={28}
              priority
            />
            <span className="font-extrabold tracking-tight">
              {config.appName}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <VersionBadge detail="build" className="hidden sm:inline" />
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
