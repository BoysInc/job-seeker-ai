"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const SessionGuard = () => {
  const { accessToken, hasHydrated, isAuthenticated, verifySession } =
    useAuth();
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated || !accessToken) return;
    if (hasVerified.current) return;

    hasVerified.current = true;

    verifySession(accessToken).catch(() => {
      // verifySession calls clearAuth internally; useAuth handles the redirect.
    });
  }, [accessToken, hasHydrated, isAuthenticated, verifySession]);

  return null;
};
