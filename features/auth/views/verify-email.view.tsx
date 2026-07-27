"use client";

import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type VerifyEmailViewProps = {
  email: string;
  isResending: boolean;
  resendMessage: string | null;
  resendError: string | null;
  onResend: () => void;
};

export const VerifyEmailView = ({
  email,
  isResending,
  resendMessage,
  resendError,
  onResend,
}: VerifyEmailViewProps) => {
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
          Verify your email
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Check your inbox.
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          We sent a verification link to <strong>{email}</strong>. Click the
          link to activate your account, then sign in below.
        </p>

        {resendMessage ? (
          <Alert className="mt-6">
            <AlertDescription>{resendMessage}</AlertDescription>
          </Alert>
        ) : null}

        {resendError ? (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{resendError}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="button"
          onClick={onResend}
          disabled={isResending}
          variant="secondary"
          className="mt-6 h-12 w-full rounded-full"
        >
          {isResending ? "Sending..." : "Resend verification email"}
        </Button>

        <Link
          href="/login"
          className="mt-6 inline-flex text-sm font-semibold text-accent-foreground transition hover:opacity-80"
        >
          Back to sign in
        </Link>
      </Card>
    </main>
  );
};
