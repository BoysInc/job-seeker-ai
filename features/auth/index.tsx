"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/use-auth";
import type { AuthFormValues } from "@/features/auth/models/auth.model";
import { resendConfirmationEmail } from "@/features/auth/services/auth.service";
import { AuthFormView } from "@/features/auth/views/auth-form.view";
import { VerifyEmailView } from "@/features/auth/views/verify-email.view";

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
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
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
      agreeToTerms: false,
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
        const auth = await signup({
          name: trimmedName,
          email: trimmedEmail,
          password: values.password,
        });

        if (!auth.session) {
          // Supabase requires email verification before a session is
          // issued - show the "check your inbox" step instead of
          // redirecting into the app with no way to actually sign in.
          setPendingVerificationEmail(trimmedEmail);
          return;
        }
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

  const handleResend = async () => {
    if (!pendingVerificationEmail) return;

    setIsResending(true);
    setResendMessage(null);
    setResendError(null);

    try {
      const response = await resendConfirmationEmail({
        email: pendingVerificationEmail,
      });
      setResendMessage(response.message);
    } catch (error) {
      setResendError(
        error instanceof Error
          ? error.message
          : "Could not resend the verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  if (pendingVerificationEmail) {
    return (
      <VerifyEmailView
        email={pendingVerificationEmail}
        isResending={isResending}
        resendMessage={resendMessage}
        resendError={resendError}
        onResend={handleResend}
      />
    );
  }

  return (
    <AuthFormView
      mode={mode}
      control={control}
      errors={errors}
      errorMessage={formError ?? errorMessage}
      isLoading={isLoading}
      passwordValue={debouncedPassword}
      register={register}
      onSubmit={handleSubmit(handleAuthSubmit)}
    />
  );
};
