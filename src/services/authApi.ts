import { baseApi } from "./baseApi";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  Preferences,
} from "@/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    verifyEmail: builder.mutation<TokenResponse, VerifyEmailRequest>({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),

    resendVerification: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    refreshToken: builder.mutation<TokenResponse, RefreshTokenRequest>({
      query: (body) => ({ url: "/auth/refresh-token", method: "POST", body }),
    }),

    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
    }),

    getMe: builder.query<{ user: import("@/types/auth.types").User }, void>({
      query: () => "/auth/me",
      providesTags: ["UserProfile"],
    }),

    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),

    // PATCH /auth/me/preferences — mood reminder + weekly digest toggles
    updatePreferences: builder.mutation<
      { message: string; preferences: Preferences },
      Partial<Preferences>
    >({
      query: (body) => ({ url: "/auth/me/preferences", method: "PATCH", body }),
      invalidatesTags: ["UserProfile"],
    }),

    // PATCH /auth/me/password — change password
    // Backend requires all 3 fields: currentPassword, newPassword, confirmPassword
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: "/auth/me/password", method: "PATCH", body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePreferencesMutation,
  useChangePasswordMutation,
} = authApi;
