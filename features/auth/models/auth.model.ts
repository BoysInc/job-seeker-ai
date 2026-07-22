export type AuthUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

export type AuthProfile = {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type MeResponse = {
  authenticated: boolean;
  user: AuthUser;
  access_token: string;
  token_type: string;
  expires_at: string;
  profile: AuthProfile;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer" | string;
  expires_in: number;
};

export type AuthResponse = {
  user: AuthUser;
  session: AuthSession;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = LoginRequest & {
  name: string;
};

export type AuthFormValues = SignupRequest;

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  accessToken: string;
  newPassword: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";
