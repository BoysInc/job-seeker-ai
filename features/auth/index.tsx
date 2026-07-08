"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/use-auth";
import type { AuthFormValues } from "@/features/auth/models/auth.model";
import { AuthFormView } from "@/features/auth/views/auth-form.view";

type AuthFeatureProps = {
  mode: "login" | "signup";
};

export const AuthFeature = ({ mode }: AuthFeatureProps) => {
  const router = useRouter();
  const {
    errorMessage,
    hasHydrated,
    isAuthenticated,
    isLoading,
    login,
    signup,
  } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const hasPasswordChanged = useRef(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    trigger,
  } = useForm<AuthFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!hasPasswordChanged.current) {
      hasPasswordChanged.current = true;
      setDebouncedPassword(password);
      return;
    }

    const timeout = window.setTimeout(() => {
      setDebouncedPassword(password);

      if (mode === "signup") {
        void trigger("password");
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [mode, password, trigger]);

  const handleAuthSubmit: SubmitHandler<AuthFormValues> = async (values) => {
    setFormError(null);

    const trimmedEmail = values.email.trim();
    const trimmedName = values.name.trim();

    if (mode === "signup" && !trimmedName) {
      setFormError("Enter your name to create an account.");
      return;
    }

    try {
      if (mode === "signup") {
        await signup({
          name: trimmedName,
          email: trimmedEmail,
          password: values.password,
        });
      } else {
        await login({
          email: trimmedEmail,
          password: values.password,
        });
      }

      router.replace("/");
    } catch {
      // The auth hook stores and exposes the backend error message.
    }
  };

  return (
    <AuthFormView
      mode={mode}
      errors={errors}
      errorMessage={formError ?? errorMessage}
      isLoading={isLoading}
      passwordValue={debouncedPassword}
      register={register}
      onSubmit={handleSubmit(handleAuthSubmit)}
    />
  );
};
