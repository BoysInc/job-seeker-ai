"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { AuthFormValues } from "@/features/auth/models/auth.model";

type AuthMode = "login" | "signup";

type AuthFormViewProps = {
  mode: AuthMode;
  errors: FieldErrors<AuthFormValues>;
  errorMessage: string | null;
  isLoading: boolean;
  passwordValue: string;
  register: UseFormRegister<AuthFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "One special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

const getPasswordStrength = (password: string) => {
  const passedRules = passwordRules.filter((rule) => rule.test(password));
  const score = passedRules.length;

  if (!password) {
    return {
      score,
      label: "Enter a password",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-zinc-200",
      textClassName: "text-zinc-500",
    };
  }

  if (score <= 2) {
    return {
      score,
      label: "Weak",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-red-500",
      textClassName: "text-red-600",
    };
  }

  if (score <= 4) {
    return {
      score,
      label: "Medium",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-amber-500",
      textClassName: "text-amber-600",
    };
  }

  return {
    score,
    label: "Strong",
    indicatorClassName: "**:data-[slot=progress-indicator]:bg-[#5f9d38]",
    textClassName: "text-[#5f9d38]",
  };
};

const validateStrongPassword = (password: string) => {
  const failedRule = passwordRules.find((rule) => !rule.test(password));
  return failedRule ? failedRule.label : true;
};

export const AuthFormView = ({
  mode,
  errors,
  errorMessage,
  isLoading,
  passwordValue,
  register,
  onSubmit,
}: AuthFormViewProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
          {isSignup ? "Signup" : "Login"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{subtitle}</p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          {isSignup ? (
            <Label className="grid gap-2 text-sm font-semibold text-zinc-700">
              Name
              <Input
                type="text"
                {...register("name", {
                  required: isSignup ? "Enter your name." : false,
                })}
                autoComplete="name"
                className="h-12 rounded-2xl border-[#dfeecf] bg-[#fbfef8] px-4 font-normal focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-accent"
              />
              {errors.name?.message ? (
                <span className="text-xs font-medium text-red-600">
                  {errors.name.message}
                </span>
              ) : null}
            </Label>
          ) : null}

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

          <Label className="grid gap-2 text-sm font-semibold text-zinc-700">
            Password
            <div className="relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                {...register("password", {
                  required: "Enter your password.",
                  validate: isSignup ? validateStrongPassword : undefined,
                })}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="h-12 w-full rounded-2xl border-[#dfeecf] bg-[#fbfef8] px-4 pr-12 font-normal focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-accent"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsPasswordVisible((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-zinc-500 hover:bg-accent hover:text-zinc-900"
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                aria-pressed={isPasswordVisible}
              >
                {isPasswordVisible ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M3 3L21 21M10.7 5.1C11.1 5 11.5 5 12 5C17.5 5 21 12 21 12C20.3 13.4 19.4 14.7 18.3 15.8M14.1 14.1C13.6 14.7 12.8 15 12 15C10.3 15 9 13.7 9 12C9 11.2 9.3 10.4 9.9 9.9M6.6 6.6C4.3 8.1 3 12 3 12C3 12 6.5 19 12 19C13.6 19 15 18.4 16.2 17.6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M3 12C3 12 6.5 5 12 5C17.5 5 21 12 21 12C21 12 17.5 19 12 19C6.5 19 3 12 3 12Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Button>
            </div>
            {errors.password?.message ? (
              <span className="text-xs font-medium text-red-600">
                {errors.password.message}
              </span>
            ) : null}
          </Label>

          {isSignup ? (
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
          className="mt-6 inline-flex text-sm font-semibold text-[#5f9d38] transition hover:text-[#4d842d]"
        >
          {alternateLabel}
        </Link>
      </Card>
    </main>
  );
};
