import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

// Auth
import { RegisterPage } from "@/features/auth/RegisterPage";
import { VerifyEmailPage } from "@/features/auth/VerifyEmailPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/ResetPasswordPage";

// Mood
import { MoodDashboard } from "@/features/mood/MoodDashboard";
import { MoodHistory } from "@/features/mood/MoodHistory";
import { MoodTrendChart } from "@/features/mood/MoodTrendChart";
import { MoodInsights } from "@/features/mood/MoodInsights";
import { BurnoutRiskCard } from "@/features/mood/BurnoutRiskCard";
import { MoodForecast } from "@/features/mood/MoodForecast";
import { MoodSentiment } from "@/features/mood/MoodSentiment";

// Habits
import { HabitDashboard } from "@/features/habits/HabitDashboard";
import { HabitDetailPage } from "@/features/habits/HabitDetailPage";
import { ArchivedHabits } from "@/features/habits/ArchivedHabits";

// AI
import { AiInsightsPage } from "@/features/ai/AiInsightsPage";
import { AiChatPage } from "@/features/ai/AiChatPage";

// Analytics
import { CorrelationPage } from "@/features/analytics/CorrelationPage";
import { HabitMatrixPage } from "@/features/analytics/HabitMatrixPage";

// Phase 11
import BadgeShelfPage from "@/features/badges/BadgeShelfPage";
import ChallengesPage from "@/features/challenges/ChallengesPage";
import LeaderboardPage from "@/features/challenges/LeaderboardPage";
import JoinChallengePage from "@/features/challenges/JoinChallengePage";
import CommunityFeedPage from "@/features/community/CommunityFeedPage";

// Phase 12
import { ProfilePage } from "@/features/profile/ProfilePage";
import { NotFoundPage } from "@/features/errors/NotFoundPage";

// Other
import { BillingPage } from "@/features/billing/BillingPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";

export const router = createBrowserRouter([
  // ── Public ─────────────────────────────────────────────────────
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

  // Challenge invite — handles own auth redirect
  { path: "/join", element: <JoinChallengePage /> },

  // 404
  { path: "/404", element: <NotFoundPage /> },

  // ── Protected ───────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/app/dashboard", element: <DashboardPage /> },

          // Mood
          { path: "/app/mood", element: <MoodDashboard /> },
          { path: "/app/mood/history", element: <MoodHistory /> },
          { path: "/app/mood/trends", element: <MoodTrendChart /> },
          { path: "/app/mood/insights", element: <MoodInsights /> },
          { path: "/app/mood/burnout", element: <BurnoutRiskCard /> },
          { path: "/app/mood/forecast", element: <MoodForecast /> },
          { path: "/app/mood/sentiment", element: <MoodSentiment /> },

          // Habits
          { path: "/app/habits", element: <HabitDashboard /> },
          { path: "/app/habits/archived", element: <ArchivedHabits /> },
          { path: "/app/habits/:id", element: <HabitDetailPage /> },

          // AI
          { path: "/app/ai", element: <AiInsightsPage /> },
          { path: "/app/ai/chat", element: <AiChatPage /> },

          // Analytics
          { path: "/app/analytics", element: <CorrelationPage /> },
          { path: "/app/analytics/matrix", element: <HabitMatrixPage /> },

          // Phase 11
          { path: "/app/badges", element: <BadgeShelfPage /> },
          { path: "/app/challenges", element: <ChallengesPage /> },
          { path: "/app/challenges/:id", element: <LeaderboardPage /> },
          { path: "/app/community", element: <CommunityFeedPage /> },

          // Phase 12
          { path: "/app/profile", element: <ProfilePage /> },

          // Billing
          { path: "/app/billing", element: <BillingPage /> },
        ],
      },
    ],
  },

  // ── Redirects ───────────────────────────────────────────────────
  { path: "/", element: <Navigate to="/app/dashboard" replace /> },
  { path: "*", element: <NotFoundPage /> }, // real 404 instead of redirect to /login
]);
