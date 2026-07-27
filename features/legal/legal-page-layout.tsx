import Link from "next/link";
import type { ReactNode } from "react";

import { AppNavbar } from "@/components/app-navbar";
import { NavAuthActions } from "@/components/nav-auth-actions";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
};

export const LegalPageLayout = ({
  eyebrow,
  title,
  lastUpdated,
  intro,
  children,
}: LegalPageLayoutProps) => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppNavbar
        actions={
          <>
            <Link
              href="/"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Home
            </Link>
            <NavAuthActions />
          </>
        }
      />
      <article className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        {intro ? (
          <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
            {intro}
          </p>
        ) : null}

        <div className="mt-8 grid gap-8 text-sm leading-7 text-muted-foreground sm:text-base [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:sm:text-xl [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-1.5 [&_p+ul]:-mt-3 [&_section]:grid [&_section]:gap-3">
          {children}
        </div>
      </article>
    </main>
  );
};
