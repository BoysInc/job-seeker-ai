"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
};

type AppNavbarProps = {
  homeHref?: string;
  centerLinks?: NavLink[];
  actions: ReactNode;
};

/**
 * App-wide top navigation. Renders full-width and sticky; place it directly
 * under <main>, outside any max-width container.
 */
export const AppNavbar = ({
  homeHref = "/",
  centerLinks,
  actions,
}: AppNavbarProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) =>
    !href.startsWith("#") &&
    (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      data-slot="app-navbar"
      className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={homeHref}
            className="flex min-w-0 shrink items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
              aria-hidden
            >
              JS
            </span>
            <span className="truncate text-base font-semibold tracking-tight">
              JobSeeker AI
            </span>
          </Link>

          {centerLinks?.length ? (
            <div className="hidden items-center gap-1 lg:flex">
              {centerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive(link.href) && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
            {actions}
          </div>
          <ThemeToggle />
          {centerLinks?.length ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="app-navbar-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          ) : null}
        </div>
      </nav>

      {/* Mobile: nav links + actions that are hidden in the top row */}
      <div
        id="app-navbar-menu"
        className={cn(
          "border-t border-border/80 px-4 py-3 sm:px-6",
          centerLinks?.length
            ? isMenuOpen
              ? "grid gap-2 lg:hidden"
              : "hidden"
            : "flex flex-wrap items-center gap-2 sm:hidden"
        )}
      >
        {centerLinks?.length && isMenuOpen ? (
          <>
            {centerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive(link.href) && "bg-muted text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border/80 pt-3 sm:hidden">
              {actions}
            </div>
          </>
        ) : !centerLinks?.length ? (
          actions
        ) : null}
      </div>
    </header>
  );
};
