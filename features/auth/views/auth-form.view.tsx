"use client";

import Link from "next/link";
import type { FormEventHandler } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Progress } from "@/components/ui/progress";
import type { AuthFormValues } from "@/features/auth/models/auth.model";
import {
  getPasswordStrength,
  passwordRules,
  validateStrongPassword,
} from "@/features/auth/utils/password-strength";

type AuthMode = "login" | "signup";

type AuthFormViewProps = {
  mode: AuthMode;
  control: Control<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  errorMessage: string | null;
  isLoading: boolean;
  passwordValue: string;
  register: UseFormRegister<AuthFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const AuthFormView = ({
  mode,
  control,
  errors,
  errorMessage,
  isLoading,
  passwordValue,
  register,
  onSubmit,
}: AuthFormViewProps) => {
  const isSignup = mode === "signup";
  const title = isSignup ? "Create your account." : "Welcome back.";
  const subtitle = isSignup
    ? "Sign up to analyze resumes and search for matched jobs."
    : "Sign in to continue using JobSeeker AI.";
  const submitLabel = isSignup ? "Create account" : "Sign in";
  const alternateHref = isSignup ? "/login" : "/signup";
  const alternateLabel = isSignup
    ? "Already have an account? Sign in"
    : "Need an account? Sign up";
  const passwordStrength = getPasswordStrength(passwordValue);
  const strengthValue = (passwordStrength.score / passwordRules.length) * 100;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6">
      <Card className="w-full max-w-md rounded-3xl p-6 shadow-xl sm:rounded-4xl sm:p-8">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold">
            JS
          </span>
          <span className="text-lg font-semibold tracking-tight">
            JobSeeker AI
          </span>
        </Link>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground">
          {isSignup ? "Signup" : "Login"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{subtitle}</p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          {isSignup ? (
            <Label className="grid gap-2 text-sm font-semibold">
              Name
              <Input
                type="text"
                {...register("name", {
                  required: isSignup ? "Enter your name." : false,
                })}
                autoComplete="name"
                className="h-12 rounded-2xl px-4 font-normal"
              />
              {errors.name?.message ? (
                <span className="text-xs font-medium text-red-600">
                  {errors.name.message}
                </span>
              ) : null}
            </Label>
          ) : null}

          <Label className="grid gap-2 text-sm font-semibold">
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
              className="h-12 rounded-2xl px-4 font-normal"
            />
            {errors.email?.message ? (
              <span className="text-xs font-medium text-red-600">
                {errors.email.message}
              </span>
            ) : null}
          </Label>

          <Label className="grid gap-2 text-sm font-semibold">
            <span className="flex items-center justify-between">
              Password
              {!isSignup ? (
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-accent-foreground transition hover:opacity-80"
                >
                  Forgot password?
                </Link>
              ) : null}
            </span>
            <PasswordInput
              {...register("password", {
                required: "Enter your password.",
                validate: isSignup ? validateStrongPassword : undefined,
              })}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="h-12 rounded-2xl px-4 font-normal"
            />
            {errors.password?.message ? (
              <span className="text-xs font-medium text-red-600">
                {errors.password.message}
              </span>
            ) : null}
          </Label>

          {isSignup ? (
            <Card className="rounded-2xl p-4">
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
                          hasPassed ? "bg-success" : "bg-border"
                        }`}
                      />
                      <span
                        className={
                          hasPassed ? "font-medium text-success" : undefined
                        }
                      >
                        {rule.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}

          {isSignup ? (
            <div>
              <label className="flex items-start gap-2.5 text-sm leading-6">
                <Controller
                  control={control}
                  name="agreeToTerms"
                  rules={{
                    required:
                      "You must agree to the Terms of Service and Privacy Policy to continue.",
                  }}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      className="mt-0.5"
                      aria-invalid={Boolean(errors.agreeToTerms)}
                    />
                  )}
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-accent-foreground hover:opacity-80"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-semibold text-accent-foreground hover:opacity-80"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.agreeToTerms?.message ? (
                <span className="mt-1 block text-xs font-medium text-red-600">
                  {errors.agreeToTerms.message}
                </span>
              ) : null}
            </div>
          ) : null}

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
            {isLoading ? "Please wait..." : submitLabel}
          </Button>
        </form>

        <Link
          href={alternateHref}
          className="mt-6 inline-flex text-sm font-semibold text-accent-foreground transition hover:opacity-80"
        >
          {alternateLabel}
        </Link>
      </Card>
    </main>
  );
};
