import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  MeResponse,
  ResetPasswordRequest,
  SignupRequest,
} from "@/features/auth/models/auth.model";

type AuthErrorResponse = {
  message?: string;
  detail?: string;
};

type MessageResponse = {
  message: string;
};

const parseAuthError = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as AuthErrorResponse;
    return payload.message ?? payload.detail ?? "Authentication failed.";
  }

  const message = await response.text();
  return message || "Authentication failed.";
};

const postAuthRequest = async (
  path: "/api/auth/login" | "/api/auth/signup",
  body: LoginRequest | SignupRequest
): Promise<AuthResponse> => {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseAuthError(response));
  }

  return (await response.json()) as AuthResponse;
};

export const loginWithBackend = (request: LoginRequest) => {
  return postAuthRequest("/api/auth/login", request);
};

export const signupWithBackend = (request: SignupRequest) => {
  return postAuthRequest("/api/auth/signup", request);
};

export const requestPasswordReset = async (
  request: ForgotPasswordRequest
): Promise<MessageResponse> => {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await parseAuthError(response));
  }

  return (await response.json()) as MessageResponse;
};

export const confirmPasswordReset = async (
  request: ResetPasswordRequest
): Promise<MessageResponse> => {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_token: request.accessToken,
      new_password: request.newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseAuthError(response));
  }

  return (await response.json()) as MessageResponse;
};

export const checkSession = async (
  accessToken: string
): Promise<MeResponse> => {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Session expired or invalid.");
  }

  return (await response.json()) as MeResponse;
};
