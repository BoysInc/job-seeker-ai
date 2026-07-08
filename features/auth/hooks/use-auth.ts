"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import type {
  LoginRequest,
  SignupRequest,
} from "@/features/auth/models/auth.model";
import {
  checkSession,
  loginWithBackend,
  signupWithBackend,
} from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

const PUBLIC_PATHS = ["/login", "/signup", "/design-preview"];

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);
  const status = useAuthStore((state) => state.status);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setStatus = useAuthStore((state) => state.setStatus);
  const setErrorMessage = useAuthStore((state) => state.setErrorMessage);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const accessToken = session?.access_token ?? null;
  const isAuthenticated =
    status === "authenticated" && Boolean(user && session);

  useEffect(() => {
    if (!hasHydrated) return;
    if (PUBLIC_PATHS.includes(pathname)) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  const login = useCallback(
    async (request: LoginRequest) => {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const auth = await loginWithBackend(request);
        setAuth(auth);
        return auth;
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Authentication failed."
        );
        throw error;
      }
    },
    [setAuth, setErrorMessage, setStatus]
  );

  const signup = useCallback(
    async (request: SignupRequest) => {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const auth = await signupWithBackend(request);
        setAuth(auth);
        return auth;
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Authentication failed."
        );
        throw error;
      }
    },
    [setAuth, setErrorMessage, setStatus]
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const verifySession = useCallback(
    async (token: string) => {
      try {
        const me = await checkSession(token);
        setProfile(me.profile);
        return me;
      } catch {
        clearAuth();
        throw new Error("Session expired.");
      }
    },
    [clearAuth, setProfile]
  );

  return {
    user,
    session,
    profile,
    status,
    errorMessage,
    hasHydrated,
    accessToken,
    isAuthenticated,
    isLoading: status === "loading",
    login,
    signup,
    logout,
    verifySession,
  };
};
