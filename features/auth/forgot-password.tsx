"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

import type { ForgotPasswordRequest } from "@/features/auth/models/auth.model";
import { requestPasswordReset } from "@/features/auth/services/auth.service";
import { ForgotPasswordView } from "@/features/auth/views/forgot-password.view";

export const ForgotPasswordFeature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordRequest>({ defaultValues: { email: "" } });

  const onSubmit: SubmitHandler<ForgotPasswordRequest> = async (values) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await requestPasswordReset({ email: values.email.trim() });
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send a reset link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordView
      errors={errors}
      errorMessage={errorMessage}
      isSubmitted={isSubmitted}
      isLoading={isLoading}
      register={register}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
