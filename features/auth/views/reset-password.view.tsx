"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Progress } from "@/components/ui/progress";
import type { ResetPasswordFormValues } from "@/features/auth/models/auth.model";
import {
  getPasswordStrength,
  passwordRules,
  validateStrongPassword,
} from "@/features/auth/utils/password-strength";

export type ResetLinkStatus = "checking" | "valid" | "invalid";
export type ResetSubmitStatus = "idle" | "loading" | "success";

type ResetPasswordViewProps = {
  linkStatus: ResetLinkStatus;
  linkError: string | null;
  submitStatus: ResetSubmitStatus;
  errors: FieldErrors<ResetPasswordFormValues>;
  errorMessage: string | null;
  passwordValue: string;
  register: UseFormRegister<ResetPasswordFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const Shell = ({ children }: { children: ReactNode }) => (
  <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6">
    <Card className="w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-[#cfe9b8]/40 sm:rounded-4xl sm:p-8">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold">
          JS
        </span>
        <span className="text-lg font-semibold tracking-tight">
          JobSeeker AI
        </span>
      </Link>
      {children}
    </Card>
  </main>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
    {children}
  </p>
);

export const ResetPasswordView = ({
  linkStatus,
  linkError,
  submitStatus,
  errors,
  errorMessage,
  passwordValue,
  register,
  onSubmit,
}: ResetPasswordViewProps) => {
  const passwordStrength = getPasswordStrength(passwordValue);
  const strengthValue = (passwordStrength.score / passwordRules.length) * 100;

  if (linkStatus === "checking") {
    return (
      <Shell>
        <Eyebrow>Reset password</Eyebrow>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          Checking your reset link...
        </p>
      </Shell>
    );
  }

  if (linkStatus === "invalid") {
    return (
      <Shell>
        <Eyebrow>Reset password</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          This link is invalid or has expired.
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {linkError ??
            "Password reset links only work once and expire after a short time."}
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex text-sm font-semibold text-[#5f9d38] transition hover:text-[#4d842d]"
        >
          Request a new reset link
        </Link>
      </Shell>
    );
  }

  if (submitStatus === "success") {
    return (
      <Shell>
        <Eyebrow>Reset password</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Password updated.
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          Your password has been changed. Sign in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex text-sm font-semibold text-[#5f9d38] transition hover:text-[#4d842d]"
        >
          Go to sign in
        </Link>
      </Shell>
    );
  }

  const isLoading = submitStatus === "loading";

  return (
    <Shell>
      <Eyebrow>Reset password</Eyebrow>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Choose a new password.
      </h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <Label className="grid gap-2 text-sm font-semibold text-zinc-700">
          New password
          <PasswordInput
            {...register("password", {
              required: "Enter a new password.",
              validate: validateStrongPassword,
            })}
            autoComplete="new-password"
            className="h-12 rounded-2xl border-[#dfeecf] bg-[#fbfef8] px-4 font-normal focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-accent"
          />
          {errors.password?.message ? (
            <span className="text-xs font-medium text-red-600">
              {errors.password.message}
            </span>
          ) : null}
        </Label>

        <Card className="rounded-2xl border-[#dfeecf] bg-[#fbfef8] p-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Password strength</span>
            <span className={passwordStrength.textClassName}>
              {passwordStrength.label}
            </span>
          </div>
          <Progress
            value={strengthValue}
            className={`mt-3 ${passwordStrength.indicatorClassName}`}
          />
          <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
            {passwordRules.map((rule) => {
              const hasPassed = rule.test(passwordValue);

              return (
                <li key={rule.label} className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hasPassed ? "bg-[#5f9d38]" : "bg-zinc-300"
                    }`}
                  />
                  <span
                    className={
                      hasPassed ? "font-medium text-[#5f9d38]" : undefined
                    }
                  >
                    {rule.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Label className="grid gap-2 text-sm font-semibold text-zinc-700">
          Confirm new password
          <PasswordInput
            {...register("confirmPassword", {
              required: "Confirm your new password.",
            })}
            autoComplete="new-password"
            className="h-12 rounded-2xl border-[#dfeecf] bg-[#fbfef8] px-4 font-normal focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-accent"
          />
          {errors.confirmPassword?.message ? (
            <span className="text-xs font-medium text-red-600">
              {errors.confirmPassword.message}
            </span>
          ) : null}
        </Label>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="submit"
          disabled={isLoading}
          variant="secondary"
          className="mt-2 h-12 rounded-full px-6"
        >
          {isLoading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Shell>
  );
};
