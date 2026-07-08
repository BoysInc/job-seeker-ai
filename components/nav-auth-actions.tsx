"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type NavAuthActionsProps = {
  showEmail?: boolean;
};

export const NavAuthActions = ({ showEmail = true }: NavAuthActionsProps) => {
  const { hasHydrated, isAuthenticated, logout, user } = useAuth();

  if (!hasHydrated) {
    return <Skeleton className="h-9 w-20 rounded-full sm:h-10 sm:w-28" />;
  }

  if (isAuthenticated) {
    return (
      <>
        {showEmail ? (
          <span className="hidden max-w-32 truncate text-xs font-medium text-zinc-600 md:inline md:max-w-48 md:text-sm">
            {user?.email}
          </span>
        ) : null}
        <Button
          type="button"
          onClick={logout}
          variant="outline"
        >
          Log out
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        render={<Link href="/login" />}
        variant="ghost"
      >
        Sign in
      </Button>
      <Button
        render={<Link href="/signup" />}
        variant="secondary"
      >
        Start free
      </Button>
    </>
  );
};
