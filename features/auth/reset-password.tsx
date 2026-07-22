"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import type { ResetPasswordFormValues } from "@/features/auth/models/auth.model";
import { confirmPasswordReset } from "@/features/auth/services/auth.service";
import {
  ResetPasswordView,
  type ResetLinkStatus,
  type ResetSubmitStatus,
} from "@/features/auth/views/reset-password.view";

// Supabase's recovery email redirects here with the session in the URL
// fragment, e.g. #access_token=...&type=recovery (or #error=...&error_description=...
// if the link already expired). Fragments never reach the server, so this
// has to be parsed client-side.
const parseHashParams = (hash: string): Record<string, string> => {
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  return Object.fromEntries(new URLSearchParams(cleaned).entries());
};

export const ResetPasswordFeature = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [linkStatus, setLinkStatus] = useState<ResetLinkStatus>("checking");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<ResetSubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  useEffect(() => {
    const params = parseHashParams(window.location.hash);

    if (params.type === "recovery" && params.access_token) {
      setAccessToken(params.access_token);
      setLinkStatus("valid");
      // Drop the tokens from the visible URL/history now that we have them.
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      setLinkError(
        params.error_description
          ? params.error_description.replace(/\+/g, " ")
          : null
      );
      setLinkStatus("invalid");
    }
  }, []);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (values) => {
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match." });
      return;
    }

    if (!accessToken) {
      setLinkStatus("invalid");
      return;
    }

    setSubmitStatus("loading");
    setErrorMessage(null);

    try {
      await confirmPasswordReset({
        accessToken,
        newPassword: values.password,
      });
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not reset your password."
      );
    }
  };

  return (
    <ResetPasswordView
      linkStatus={linkStatus}
      linkError={linkError}
      submitStatus={submitStatus}
      errors={errors}
      errorMessage={errorMessage}
      passwordValue={password}
      register={register}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
