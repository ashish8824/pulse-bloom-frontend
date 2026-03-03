export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: Pick<User, "id" | "email" | "name" | "isVerified">;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export type Plan = "free" | "pro" | "enterprise";
