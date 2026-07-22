"use client";

import Link from "next/link";
import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ForgotPasswordRequest } from "@/features/auth/models/auth.model";

type ForgotPasswordViewProps = {
  errors: FieldErrors<ForgotPasswordRequest>;
  errorMessage: string | null;
  isSubmitted: boolean;
  isLoading: boolean;
  register: UseFormRegister<ForgotPasswordRequest>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const ForgotPasswordView = ({
  errors,
  errorMessage,
  isSubmitted,
  isLoading,
  register,
  onSubmit,
}: ForgotPasswordViewProps) => {
  return (
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

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
          Forgot password
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Reset your password.
        </h1>

        {isSubmitted ? (
          <>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              If an account exists for that email, we&apos;ve sent a link to
              reset your password. Check your inbox.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex text-sm font-semibold text-[#5f9d38] transition hover:text-[#4d842d]"
            >
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              Enter the email on your account and we&apos;ll send you a link
              to reset your password.
            </p>

            <form onSubmit={onSubmit} className="mt-8 grid gap-4">
              <Label className="grid gap-2 text-sm font-semibold text-zinc-700">
                Email
                <Input
                  type="email"
                  {...register("email", {
                    required: "Enter your email.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                  autoComplete="email"
                  className="h-12 rounded-2xl border-[#dfeecf] bg-[#fbfef8] px-4 font-normal focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-accent"
                />
                {errors.email?.message ? (
                  <span className="text-xs font-medium text-red-600">
                    {errors.email.message}
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
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-6 inline-flex text-sm font-semibold text-[#5f9d38] transition hover:text-[#4d842d]"
            >
              Back to sign in
            </Link>
          </>
        )}
      </Card>
    </main>
  );
};
