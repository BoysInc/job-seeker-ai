"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AuthProfile,
  AuthResponse,
  AuthSession,
  AuthStatus,
  AuthUser,
} from "@/features/auth/models/auth.model";

type AuthStore = {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: AuthProfile | null;
  status: AuthStatus;
  errorMessage: string | null;
  hasHydrated: boolean;
  setAuth: (auth: AuthResponse) => void;
  setProfile: (profile: AuthProfile) => void;
  setStatus: (status: AuthStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,
      status: "unauthenticated",
      errorMessage: null,
      hasHydrated: false,
      setAuth: (auth) =>
        set({
          user: auth.user,
          session: auth.session,
          status: "authenticated",
          errorMessage: null,
        }),
      setProfile: (profile) => set({ profile }),
      setStatus: (status) => set({ status }),
      setErrorMessage: (message) => set({ errorMessage: message }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      clearAuth: () =>
        set({
          user: null,
          session: null,
          profile: null,
          status: "unauthenticated",
          errorMessage: null,
        }),
    }),
    {
      name: "job-seeker-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
        status: state.status,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.setStatus(
          state.user && state.session ? "authenticated" : "unauthenticated"
        );
      },
    }
  )
);
