"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Monitor,
  Users,
  History,
  Settings,
  Plus,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ButtonAccount from "@/components/ButtonAccount";
import config from "@/config";
import logo from "@/app/icon.png";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  teamOnly?: boolean;
}

const navigation: NavItem[] = [
  { name: "Projects", href: "/dashboard", icon: FolderKanban },
  { name: "Devices", href: "/dashboard/devices", icon: Monitor },
  { name: "Team", href: "/dashboard/team", icon: Users, teamOnly: true },
  { name: "History", href: "/dashboard/history", icon: History },
];

const secondaryNavigation: NavItem[] = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // TODO: Get user's plan from session to show/hide Team nav
  const hasTeamPlan = true; // Placeholder

  // Navigation items component (reusable for desktop and mobile)
  const NavigationItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            // Hide team nav if user doesn't have team plan
            if (item.teamOnly && !hasTeamPlan) return null;

            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" &&
                pathname.startsWith("/dashboard/project/"));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_currentColor]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon
                  className={`flex-shrink-0 w-4 h-4 ${
                    isActive ? "text-primary" : ""
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings Navigation */}
      <div className="px-3 pb-3">
        <div className="h-px bg-primary/10 mb-3" />
        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_currentColor]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon
                  className={`flex-shrink-0 w-4 h-4 ${
                    isActive ? "text-primary" : ""
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Account Section */}
      <div className="p-4 border-t border-primary/10">
        <ButtonAccount />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)]">
              <Image
                src={logo}
                alt={config.appName}
                className="w-5 h-5"
                width={20}
                height={20}
              />
            </div>
            <span className="font-bold text-foreground">{config.appName}</span>
          </Link>

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex flex-col h-full bg-gradient-to-b from-muted/50 via-muted/30 to-muted/50">
                {/* Mobile Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)]">
                      <Image
                        src={logo}
                        alt={config.appName}
                        className="w-5 h-5"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span className="font-bold text-foreground">
                      {config.appName}
                    </span>
                  </Link>
                </div>

                {/* New Project Button */}
                <div className="p-4">
                  <Button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("openCreateProject")
                      );
                      setIsMobileOpen(false);
                    }}
                    className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_8px_rgba(0,0,0,0.15)]"
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                </div>

                {/* Navigation Items */}
                <NavigationItems onNavigate={() => setIsMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-gradient-to-b from-muted/50 via-muted/30 to-muted/50 transition-all duration-300 z-40 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)]">
                  <Image
                    src={logo}
                    alt={config.appName}
                    className="w-5 h-5"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {config.appName}
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* New Project Button */}
          {!isCollapsed && (
            <div className="p-4">
              <Button
                onClick={() => {
                  // Dispatch custom event that DashboardClient will listen to
                  window.dispatchEvent(new CustomEvent("openCreateProject"));
                }}
                className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(0,0,0,0.2)] hover:translate-y-[-1px] transition-all"
              >
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>
          )}

          {isCollapsed && (
            <div className="p-4 flex justify-center">
              <Button
                size="icon"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("openCreateProject"));
                }}
                className="w-10 h-10 bg-primary hover:bg-primary/90 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_8px_rgba(0,0,0,0.15)]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                // Hide team nav if user doesn't have team plan
                if (item.teamOnly && !hasTeamPlan) return null;

                // Check if current route matches this nav item
                // For Projects, also match /dashboard/project/[id]
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard" &&
                    pathname.startsWith("/dashboard/project/"));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_currentColor]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon
                      className={`flex-shrink-0 ${
                        isCollapsed ? "w-5 h-5" : "w-4 h-4"
                      } ${isActive ? "text-primary" : ""}`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Settings Navigation */}
          <div className="px-3 pb-3">
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_currentColor]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon
                      className={`flex-shrink-0 ${
                        isCollapsed ? "w-5 h-5" : "w-4 h-4"
                      } ${isActive ? "text-primary" : ""}`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Account Section */}
          <div className="p-4 border-t border-border">
            <ButtonAccount />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - TODO: Add mobile sheet/drawer */}
    </>
  );
}
