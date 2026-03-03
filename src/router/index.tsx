import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

// Auth pages
import { RegisterPage } from "@/features/auth/RegisterPage";
import { VerifyEmailPage } from "@/features/auth/VerifyEmailPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/ResetPasswordPage";

// Mood pages
import { MoodDashboard } from "@/features/mood/MoodDashboard";
import { MoodHistory } from "@/features/mood/MoodHistory";
import { MoodTrendChart } from "@/features/mood/MoodTrendChart";
import { MoodInsights } from "@/features/mood/MoodInsights";
import { BurnoutRiskCard } from "@/features/mood/BurnoutRiskCard";

// Habit pages
import { HabitDashboard } from "@/features/habits/HabitDashboard";
import { HabitDetailPage } from "@/features/habits/HabitDetailPage";
import { ArchivedHabits } from "@/features/habits/ArchivedHabits";

// Other pages
import { AiInsightsPage } from "@/features/ai/AiInsightsPage";
import { BillingPage } from "@/features/billing/BillingPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { DashboardPage } from "../features/dashboard/DashboardPage";

export const router = createBrowserRouter([
  // ── Public routes ───────────────────────────────────────────────
  {
    path: "/register",
    element: (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <AuthLayout>
        <VerifyEmailPage />
      </AuthLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },

  // ── Protected routes ────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Mood
          { path: "/app/dashboard", element: <DashboardPage /> },
          { path: "/app/mood", element: <MoodDashboard /> },
          { path: "/app/mood/history", element: <MoodHistory /> },
          { path: "/app/mood/trends", element: <MoodTrendChart /> },
          { path: "/app/mood/insights", element: <MoodInsights /> },
          { path: "/app/mood/burnout", element: <BurnoutRiskCard /> },

          // Habits
          { path: "/app/habits", element: <HabitDashboard /> },
          { path: "/app/habits/archived", element: <ArchivedHabits /> },
          { path: "/app/habits/:id", element: <HabitDetailPage /> },

          // Other
          { path: "/app/ai", element: <AiInsightsPage /> },
          { path: "/app/billing", element: <BillingPage /> },
          { path: "/app/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },

  // ── Redirects ───────────────────────────────────────────────────
  { path: "/", element: <Navigate to="/app/dashboard" replace /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
