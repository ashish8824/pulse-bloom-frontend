# 🌸 PulseBloom Frontend

> **React + TypeScript + Vite** — Behavioral analytics platform frontend with mood tracking, habit building, AI insights, and subscription billing.
>
> **Current Status: Phases 1–10 Complete. Next: Phase 11 — AI Insights + Billing.**

---

## 📦 Tech Stack

| Layer            | Technology                              | Notes                    |
| ---------------- | --------------------------------------- | ------------------------ |
| Framework        | React 18 + TypeScript + Vite 7          |                          |
| State Management | Redux Toolkit + RTK Query               |                          |
| Styling          | Tailwind CSS — dark theme, mobile-first |                          |
| Routing          | React Router v6                         |                          |
| Forms            | React Hook Form + Zod                   |                          |
| Charts           | Recharts + react-is (required peer dep) |                          |
| Drag & Drop      | @hello-pangea/dnd                       | Habit reordering via DnD |
| Dates            | date-fns                                |                          |
| Icons            | lucide-react                            |                          |
| Toasts           | react-hot-toast                         |                          |
| Class utils      | clsx + tailwind-merge                   |                          |

---

## 🗂️ Complete Folder Structure

```
pulsebloom-frontend/
├── src/
│   ├── app/
│   │   ├── store.ts                    ✅ Redux store (auth + RTK Query)
│   │   └── hooks.ts                    ✅ Typed useAppDispatch + useAppSelector
│   │
│   ├── services/
│   │   ├── baseApi.ts                  ✅ RTK Query base + token refresh interceptor
│   │   ├── authApi.ts                  ✅ 9 auth endpoints
│   │   ├── moodApi.ts                  ✅ 15 mood endpoints (all URLs verified)
│   │   ├── habitApi.ts                 ✅ 15 habit endpoints (all URLs verified)
│   │   ├── aiApi.ts                    ✅ 3 AI endpoints (insights, suggestions, chat)
│   │   ├── analyticsApi.ts             ✅ 2 cross-module analytics endpoints
│   │   ├── notificationApi.ts          ✅ 4 notification endpoints
│   │   ├── badgeApi.ts                 ✅ Badge shelf endpoint
│   │   ├── challengeApi.ts             ✅ 7 challenge endpoints
│   │   ├── communityApi.ts             ✅ 3 community feed endpoints
│   │   └── billingApi.ts               ✅ 5 Razorpay billing endpoints
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts            ✅ User, tokens, plan state
│   │   │   ├── RegisterPage.tsx        ✅ Zod validation, password show/hide (Eye icon)
│   │   │   ├── VerifyEmailPage.tsx     ✅ 6-box OTP, paste, backspace nav, 60s resend
│   │   │   ├── LoginPage.tsx           ✅ Zod validation, password show/hide (Eye icon)
│   │   │   ├── ForgotPasswordPage.tsx  ✅ Success state (prevents user enumeration)
│   │   │   ├── ResetPasswordPage.tsx   ✅ Token from URL, password match validation
│   │   │   └── ProtectedRoute.tsx      ✅ Reads localStorage directly — avoids Redux hydration race
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx       ✅ Overview — mood stats + habits + AI module cards
│   │   │
│   │   ├── mood/
│   │   │   ├── MoodDashboard.tsx       ✅ Stats, 13-week heatmap, 5 quick nav links
│   │   │   ├── MoodLogForm.tsx         ✅ Score picker (1-5 emoji), journal, tag chips
│   │   │   ├── MoodHistory.tsx         ✅ Paginated list, inline edit/delete, plan limit banner
│   │   │   ├── MoodTrendChart.tsx      ✅ Weekly avg + 7-day rolling average (Recharts)
│   │   │   ├── MoodInsights.tsx        ✅ Day-of-week bar chart + time-of-day grid (null-safe)
│   │   │   ├── BurnoutRiskCard.tsx     ✅ Donut score gauge + metrics (Insufficient Data safe)
│   │   │   ├── MoodForecast.tsx        ✅ 7-day predictive forecast with signal breakdown
│   │   │   ├── MoodSentiment.tsx       ✅ Sentiment vs mood chart + divergence table
│   │   │   ├── MoodHeatmap.tsx         🔜 Standalone page (placeholder)
│   │   │   ├── MoodCalendar.tsx        🔜 Monthly calendar (placeholder)
│   │   │   └── MoodEntryModal.tsx      🔜 Standalone modal (placeholder)
│   │   │
│   │   ├── habits/
│   │   │   ├── HabitDashboard.tsx      ✅ Stats row, DnD list, free plan gate, completedTodayIds state
│   │   │   ├── HabitList.tsx           ✅ DragDropContext + Droppable, onCompleted/onUndone callbacks
│   │   │   ├── HabitCard.tsx           ✅ Complete/undo, edit/delete, milestone toast trigger
│   │   │   ├── HabitForm.tsx           ✅ Zod, icon picker, color swatches, split update endpoints
│   │   │   ├── HabitDetailPage.tsx     ✅ Done Today button, 2-col analytics layout
│   │   │   ├── HabitHeatmap.tsx        ✅ 365-day grid, maps data.heatmap correctly
│   │   │   ├── HabitCalendar.tsx       ✅ Monthly grid, maps data.calendar correctly
│   │   │   ├── HabitAnalyticsCard.tsx  ✅ DonutChart (consistency %) + 6 metrics
│   │   │   ├── HabitLogHistory.tsx     ✅ Paginated, uses data.logs + data.totalPages
│   │   │   ├── ArchivedHabits.tsx      ✅ Restore + permanent delete with confirmation
│   │   │   └── MilestoneToast.tsx      ✅ 7/14/21/30/60/90/100/180/365 day streak toasts
│   │   │
│   │   ├── ai/
│   │   │   ├── AiInsightsPage.tsx      🔜 Phase 11 — insights + suggestions + coach chat
│   │   │   ├── InsightCard.tsx         🔜 Phase 11
│   │   │   ├── SuggestionsPanel.tsx    🔜 Phase 11
│   │   │   ├── AiChatPage.tsx          🔜 Phase 11
│   │   │   └── AiPlanGate.tsx          🔜 Phase 11
│   │   │
│   │   ├── analytics/
│   │   │   ├── CorrelationPage.tsx     🔜 Phase 11 — mood ↔ habit lift
│   │   │   └── HabitMatrixPage.tsx     🔜 Phase 11 — co-completion matrix
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationBell.tsx    🔜 Phase 11 — unread count badge
│   │   │   └── NotificationDrawer.tsx  🔜 Phase 11 — paginated list + mark read
│   │   │
│   │   ├── badges/
│   │   │   └── BadgeShelfPage.tsx      🔜 Phase 11 — earned + locked badges
│   │   │
│   │   ├── challenges/
│   │   │   ├── ChallengesPage.tsx      🔜 Phase 11 — browse + create
│   │   │   ├── ChallengeCard.tsx       🔜 Phase 11
│   │   │   └── LeaderboardPage.tsx     🔜 Phase 11
│   │   │
│   │   ├── community/
│   │   │   ├── CommunityFeedPage.tsx   🔜 Phase 11 — anonymous feed + upvote
│   │   │   └── CreatePostModal.tsx     🔜 Phase 11
│   │   │
│   │   ├── billing/
│   │   │   ├── BillingPage.tsx         🔜 Phase 11
│   │   │   ├── PricingPlans.tsx        🔜 Phase 11
│   │   │   ├── RazorpayCheckout.tsx    🔜 Phase 11
│   │   │   └── UpgradeBanner.tsx       🔜 Phase 11
│   │   │
│   │   └── profile/
│   │       ├── ProfilePage.tsx         🔜 Phase 12
│   │       └── PreferencesForm.tsx     🔜 Phase 12 — mood reminder + weekly digest toggles
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx              ✅ 5 variants, 3 sizes, loading, fullWidth
│   │   │   ├── Input.tsx               ✅ Label, error, hint, focus ring
│   │   │   ├── Textarea.tsx            ✅ Multiline, resize-none
│   │   │   ├── Badge.tsx               ✅ 6 color variants, 2 sizes
│   │   │   ├── Modal.tsx               ✅ Fixed overlay, flex-col panel, max-h-[90vh], sticky footer support
│   │   │   ├── Spinner.tsx             ✅ 3 sizes
│   │   │   ├── Skeleton.tsx            ✅ Pulse animation + CardSkeleton preset
│   │   │   ├── Tabs.tsx                ✅ Active highlight, icon support
│   │   │   ├── Tooltip.tsx             ✅ 4 positions, hover show/hide
│   │   │   └── EmptyState.tsx          ✅ Icon, title, description, optional CTA
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx           ✅ Flex layout, manages sidebarOpen state
│   │   │   ├── Sidebar.tsx             ✅ Nav links, user info, plan badge, logout
│   │   │   ├── Topbar.tsx              ✅ Page title, hamburger (mobile), plan badge
│   │   │   └── AuthLayout.tsx          ✅ Centered card, background glows
│   │   │
│   │   └── charts/
│   │       ├── HeatmapGrid.tsx         ✅ Fixed-position tooltip (z-9999), never clipped
│   │       ├── LineChart.tsx           ✅ Multi-line, dark styled, ResponsiveContainer
│   │       ├── BarChart.tsx            ✅ Color function support, dark styled
│   │       └── DonutChart.tsx          ✅ Centre label, configurable color + size
│   │
│   ├── hooks/
│   │   ├── usePlanGate.ts              ✅ Returns { canAccess, requiredPlan, currentPlan }
│   │   ├── useDebounce.ts              ✅ Generic, configurable delay
│   │   ├── useLocalStorage.ts          ✅ Type-safe get/set wrapper
│   │   └── useTokenRefresh.ts          🔜 Future
│   │
│   ├── utils/
│   │   ├── formatDate.ts               ✅ formatDate, formatDateTime, formatRelative
│   │   ├── moodColor.ts                ✅ moodToBg, moodToText, moodToLabel, moodEmojis
│   │   ├── planLimits.ts               ✅ FREE_HABIT_LIMIT=3, FREE_MOOD_HISTORY_DAYS=30
│   │   └── errorParser.ts              ✅ RTK Query error → readable string
│   │
│   ├── types/
│   │   ├── auth.types.ts               ✅ User, AuthState, Plan, LoginRequest, TokenResponse, Preferences
│   │   ├── mood.types.ts               ✅ All mood types + SentimentTrendsResponse + MoodForecastResponse
│   │   ├── habit.types.ts              ✅ Habit, HabitLog, HabitLogEntry, HabitLogResponse, Analytics, Heatmap, Calendar
│   │   ├── ai.types.ts                 ✅ AiInsight, InsightType, InsightSeverity, AiSuggestion, AiChatMessage
│   │   ├── analytics.types.ts          ✅ CorrelationResponse, HabitMatrixResponse
│   │   ├── notification.types.ts       ✅ Notification, NotificationType, UnreadCountResponse
│   │   ├── badge.types.ts              ✅ Badge, BadgeType, BadgeShelfResponse
│   │   ├── challenge.types.ts          ✅ Challenge, ChallengeParticipant, LeaderboardResponse
│   │   ├── community.types.ts          ✅ CommunityPost, PostType, FeedResponse
│   │   └── billing.types.ts            ✅ Plan, Subscription, BillingStatus, Order, Verify
│   │
│   ├── router/
│   │   └── index.tsx                   ✅ All routes wired
│   │
│   ├── App.tsx                         ✅ RouterProvider + dark Toaster
│   ├── main.tsx                        ✅ Redux Provider
│   ├── index.css                       ✅ Tailwind + .card + .glass
│   └── vite-env.d.ts                   ✅ ImportMetaEnv declarations
│
├── .env                                VITE_API_BASE_URL, VITE_RAZORPAY_KEY_ID
├── .env.example
├── tailwind.config.js                  ✅ Brand purple palette + Inter font
├── tsconfig.app.json                   ✅ @/* alias, moduleResolution: bundler
├── tsconfig.node.json                  ✅ composite: true, noEmit: false
├── tsconfig.json                       ✅ References app + node
└── vite.config.ts                      ✅ @ alias, port 3000
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+
- PulseBloom Backend running on `http://localhost:5000`

### Install & Run (Windows PowerShell)

```powershell
# Install all dependencies
npm install

# Install recharts peer dependency (REQUIRED — do this once)
npm install react-is

# Start dev server
npm run dev
# → http://localhost:3000

# If you see recharts "504 Outdated Optimize Dep" error:
Remove-Item -Recurse -Force node_modules/.vite
npm run dev -- --force

# Production build
npm run build
```

### `.env` (root of project)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

> ⚠️ NEVER put `RAZORPAY_KEY_SECRET` in frontend `.env`

---

## 🏗️ Architecture

```
Page Component
  → RTK Query hook (useGetXxxQuery / useXxxMutation)
    → API Slice (injectEndpoints on baseApi)
      → baseQueryWithReauth
        → rawBaseQuery (attaches Bearer token from Redux)
          → Backend API

On 401:
  baseQueryWithReauth → POST /auth/refresh-token (rawBaseQuery directly — avoids infinite loop)
    ↓ success → dispatch(updateAccessToken()) → retry original
    ↓ failure → dispatch(logout()) → /login
```

### Key Principles

- **Feature-sliced** — each feature folder is self-contained
- **RTK Query** — zero manual fetch/axios. All API state cached + auto-invalidated
- **Access token in Redux memory only** — never localStorage (XSS safe)
- **Refresh token in localStorage** — ProtectedRoute reads directly (not Redux) to avoid hydration race on hard refresh
- **Mobile-first** — all components use Tailwind `sm:` `md:` `lg:` breakpoints consistently

---

## 🔐 Authentication — Complete

### Token Strategy

| Token          | Storage           | Lifetime | Reason                  |
| -------------- | ----------------- | -------- | ----------------------- |
| `accessToken`  | Redux memory only | 15 min   | Never in DOM → XSS safe |
| `refreshToken` | `localStorage`    | 7 days   | Survives page refresh   |

### Full Auth Flow

```
1. Register → POST /auth/register → /verify-email?email=...
2. OTP Verify → POST /auth/verify-email → setCredentials() → /app/dashboard
3. Login → POST /auth/login → setCredentials() → /app/dashboard

4. Hard Page Refresh (ProtectedRoute):
   Redux clears → refreshToken = localStorage.getItem('refreshToken') ← direct read
   → raw fetch POST /auth/refresh-token
   → success: setCredentials() → stay on same page ✅
   → failure: logout() → /login

5. Expired access token during API call:
   baseQueryWithReauth detects 401
   → POST /auth/refresh-token via rawBaseQuery
   → success: updateAccessToken() → retry original request
   → double 401: logout()
```

### Auth Pages

| Page                 | Route              | Features                                               |
| -------------------- | ------------------ | ------------------------------------------------------ |
| `RegisterPage`       | `/register`        | Zod rules, Eye toggle on password                      |
| `VerifyEmailPage`    | `/verify-email`    | 6 individual boxes, paste support, 60s resend cooldown |
| `LoginPage`          | `/login`           | Eye toggle, auto-redirect if already logged in         |
| `ForgotPasswordPage` | `/forgot-password` | Always shows success (prevents user enumeration)       |
| `ResetPasswordPage`  | `/reset-password`  | `?token=` from URL, confirm password match             |

---

## 🔌 RTK Query — All API Slices

### baseApi.ts

```typescript
// Every request: attaches Authorization: Bearer <accessToken>
// On 401: tries refresh via rawBaseQuery (bypasses interceptor to avoid infinite loop)
// On refresh success: updateAccessToken() → retry original request
// On refresh failure: logout() → /login
```

### Mood API — `moodApi.ts` (15 endpoints)

```ts
useCreateMoodMutation; // POST /mood
useGetMoodsQuery; // GET  /mood  (+ planLimitApplied in response)
useGetMoodByIdQuery; // GET  /mood/:id
useUpdateMoodMutation; // PATCH /mood/:id
useDeleteMoodMutation; // DELETE /mood/:id
useGetMoodAnalyticsQuery; // GET  /mood/analytics
useGetMoodStreakQuery; // GET  /mood/streak
useGetMoodHeatmapQuery; // GET  /mood/heatmap?days=N
useGetMoodMonthlySummaryQuery; // GET  /mood/summary/monthly
useGetMoodDailyInsightsQuery; // GET  /mood/insights/daily
useGetWeeklyTrendsQuery; // GET  /mood/trends/weekly
useGetRollingAverageQuery; // GET  /mood/trends/rolling
useGetBurnoutRiskQuery; // GET  /mood/burnout-risk
useGetSentimentTrendsQuery; // GET  /mood/sentiment/trends
useGetMoodForecastQuery; // GET  /mood/forecast
```

### Auth API — `authApi.ts` (9 endpoints)

```ts
(useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation);
// + PATCH /auth/me/preferences for mood reminder + weekly digest settings
```

### Habit API — `habitApi.ts` (15 endpoints)

```ts
useCreateHabitMutation; // POST   /habits
useGetHabitsQuery; // GET    /habits
useGetArchivedHabitsQuery; // GET    /habits/archived
useUpdateHabitMutation; // PATCH  /habits/:id          ← habit fields only
useUpdateReminderMutation; // PATCH  /habits/:id/reminder ← reminder fields ONLY (separate endpoint!)
useDeleteHabitMutation; // DELETE /habits/:id          (soft-delete → archive)
useRestoreHabitMutation; // PATCH  /habits/:id/restore
useReorderHabitsMutation; // PATCH  /habits/reorder      body: { habits: [{ id, sortOrder }] }
useCompleteHabitMutation; // POST   /habits/:id/complete
useUndoCompletionMutation; // DELETE /habits/:id/complete
useGetHabitStreakQuery; // GET    /habits/:id/streak
useGetHabitAnalyticsQuery; // GET    /habits/:id/analytics
useGetHabitMonthlySummaryQuery; // GET    /habits/:id/summary?month=YYYY-MM
useGetHabitHeatmapQuery; // GET    /habits/:id/heatmap?days=N
useGetHabitLogsQuery; // GET    /habits/:id/logs?page=N&limit=N
```

### AI API — `aiApi.ts` (3 endpoints — Phase 11)

```ts
useGetAiInsightsQuery; // GET  /ai/insights(?refresh=true)  — Pro/Enterprise only
useGetAiSuggestionsQuery; // GET  /ai/suggestions(?refresh=true) — Pro/Enterprise only
useSendAiChatMutation; // POST /ai/chat { message, conversationId? } — Pro/Enterprise only
```

### Analytics API — `analyticsApi.ts` (2 endpoints — Phase 11)

```ts
useGetCorrelationQuery; // GET /analytics/correlation  — mood ↔ habit lift per habit
useGetHabitMatrixQuery; // GET /analytics/habit-matrix — co-completion rates
```

### Notifications API — `notificationApi.ts` (4 endpoints — Phase 11)

```ts
useGetNotificationsQuery; // GET   /notifications?page=1&limit=20
useGetUnreadCountQuery; // GET   /notifications/unread-count
useMarkNotificationReadMutation; // PATCH /notifications/:id/read
useMarkAllReadMutation; // PATCH /notifications/read-all
```

### Badges API — `badgeApi.ts` (1 endpoint — Phase 11)

```ts
useGetBadgeShelfQuery; // GET /badges — earned (with dates) + locked (with hints)
```

### Challenges API — `challengeApi.ts` (7 endpoints — Phase 11)

```ts
useGetChallengesQuery; // GET  /challenges
useCreateChallengeMutation; // POST /challenges
useGetMyChallengesQuery; // GET  /challenges/mine
useGetJoinedChallengesQuery; // GET  /challenges/joined
useJoinChallengeMutation; // POST /challenges/:id/join
useCompleteChallengeDay; // POST /challenges/:id/complete (free-form only)
useGetLeaderboardQuery; // GET  /challenges/:id/leaderboard
```

### Community API — `communityApi.ts` (3 endpoints — Phase 11)

```ts
useGetCommunityFeedQuery; // GET  /community (optional auth → hasUpvoted flag)
useCreateCommunityPostMutation; // POST /community
useToggleUpvoteMutation; // POST /community/:id/upvote
```

### Billing API — `billingApi.ts` (5 endpoints — Phase 11)

```ts
useCreateOrderMutation; // POST   /billing/order
useVerifyPaymentMutation; // POST   /billing/verify
useGetBillingStatusQuery; // GET    /billing/status
useCancelSubscriptionMutation; // DELETE /billing/subscription
```

### Cache Tag Invalidation

| Tag              | Invalidated by                                                     |
| ---------------- | ------------------------------------------------------------------ |
| `MoodEntry`      | createMood, updateMood, deleteMood                                 |
| `MoodAnalytics`  | createMood, updateMood, deleteMood                                 |
| `MoodStreak`     | createMood, deleteMood                                             |
| `MoodHeatmap`    | createMood, updateMood, deleteMood                                 |
| `MoodSummary`    | createMood, updateMood, deleteMood                                 |
| `BurnoutRisk`    | createMood, deleteMood                                             |
| `Habit`          | createHabit, updateHabit, deleteHabit, reorderHabits, restoreHabit |
| `HabitLog`       | completeHabit, undoCompletion                                      |
| `HabitStreak`    | completeHabit, undoCompletion                                      |
| `HabitAnalytics` | completeHabit, undoCompletion                                      |
| `HabitHeatmap`   | completeHabit, undoCompletion                                      |
| `Notification`   | markRead, markAllRead                                              |
| `BillingStatus`  | verifyPayment, cancelSubscription                                  |

---

## 🛣️ All Routes

| Route                  | Component          | Auth | Status      |
| ---------------------- | ------------------ | ---- | ----------- |
| `/`                    | → `/app/dashboard` | ❌   | ✅          |
| `/register`            | RegisterPage       | ❌   | ✅          |
| `/verify-email`        | VerifyEmailPage    | ❌   | ✅          |
| `/login`               | LoginPage          | ❌   | ✅          |
| `/forgot-password`     | ForgotPasswordPage | ❌   | ✅          |
| `/reset-password`      | ResetPasswordPage  | ❌   | ✅          |
| `/app/dashboard`       | DashboardPage      | ✅   | ✅          |
| `/app/mood`            | MoodDashboard      | ✅   | ✅          |
| `/app/mood/history`    | MoodHistory        | ✅   | ✅          |
| `/app/mood/trends`     | MoodTrendChart     | ✅   | ✅          |
| `/app/mood/insights`   | MoodInsights       | ✅   | ✅          |
| `/app/mood/burnout`    | BurnoutRiskCard    | ✅   | ✅          |
| `/app/mood/forecast`   | MoodForecast       | ✅   | ✅          |
| `/app/mood/sentiment`  | MoodSentiment      | ✅   | ✅          |
| `/app/habits`          | HabitDashboard     | ✅   | ✅          |
| `/app/habits/archived` | ArchivedHabits     | ✅   | ✅          |
| `/app/habits/:id`      | HabitDetailPage    | ✅   | ✅          |
| `/app/ai`              | AiInsightsPage     | ✅   | 🔜 Phase 11 |
| `/app/ai/chat`         | AiChatPage         | ✅   | 🔜 Phase 11 |
| `/app/analytics`       | CorrelationPage    | ✅   | 🔜 Phase 11 |
| `/app/badges`          | BadgeShelfPage     | ✅   | 🔜 Phase 11 |
| `/app/challenges`      | ChallengesPage     | ✅   | 🔜 Phase 11 |
| `/app/challenges/:id`  | LeaderboardPage    | ✅   | 🔜 Phase 11 |
| `/app/community`       | CommunityFeedPage  | ✅   | 🔜 Phase 11 |
| `/app/billing`         | BillingPage        | ✅   | 🔜 Phase 11 |
| `/app/profile`         | ProfilePage        | ✅   | 🔜 Phase 12 |
| `*`                    | → `/login`         | ❌   | ✅          |

---

## 🎨 Design System

### Brand Colors (`tailwind.config.js`)

```js
brand: {
  50:  '#fdf4ff',
  400: '#d974fa',   // text accents
  500: '#c44ef0',   // focus rings, hover
  600: '#a92fd4',   // buttons, active nav
  700: '#8b23ad',
}
```

### Base Utilities (`index.css`)

```css
.card  → bg-gray-900 border border-gray-800 rounded-2xl
.glass → bg-white/5 backdrop-blur-sm border border-white/10
```

### Responsive Breakpoints

| Breakpoint    | Sidebar                              | Grids   | Padding |
| ------------- | ------------------------------------ | ------- | ------- |
| Mobile `< lg` | Drawer (hamburger toggle + backdrop) | 2-col   | `p-4`   |
| Desktop `lg+` | Always visible `w-64`                | 3–4 col | `p-6`   |

### Component Quick Reference

```
Button     → variant: primary|secondary|ghost|destructive|outline
           → size: sm|md|lg, loading, fullWidth

Badge      → variant: default|success|warning|danger|info|purple
           → size: sm|md

Modal      → size: sm|md|lg|xl
           → Fixed overlay (never page-scrolls), flex-col panel, max-h-[90vh]
           → Body: flex-1 overflow-y-auto (modal scrolls internally)
           → Footer: sticky bottom-0 bg-gray-900 (always visible and clickable)

EmptyState → icon?, title, description?, action?: { label, onClick }
```

---

## 📊 Mood Module — Phase 9 Complete

### All Components

| Component         | Route                 | Status                                           |
| ----------------- | --------------------- | ------------------------------------------------ |
| `MoodDashboard`   | `/app/mood`           | ✅ Stats + heatmap + 5 quick nav links           |
| `MoodLogForm`     | Modal                 | ✅ Emoji score, journal, tags                    |
| `MoodHistory`     | `/app/mood/history`   | ✅ Paginated, plan limit banner                  |
| `MoodTrendChart`  | `/app/mood/trends`    | ✅ Weekly + rolling avg                          |
| `MoodInsights`    | `/app/mood/insights`  | ✅ DOW + TOD patterns (null-safe)                |
| `BurnoutRiskCard` | `/app/mood/burnout`   | ✅ Donut + metrics (all riskLevels handled)      |
| `MoodForecast`    | `/app/mood/forecast`  | ✅ 7-day prediction + signal breakdown           |
| `MoodSentiment`   | `/app/mood/sentiment` | ✅ AI sentiment vs mood chart + divergence table |

### Backend API URLs (all verified)

```
POST /mood
GET  /mood                    ← planLimitApplied in response for free users
GET  /mood/:id
PATCH /mood/:id
DELETE /mood/:id
GET  /mood/streak
GET  /mood/heatmap
GET  /mood/analytics
GET  /mood/burnout-risk        ← NOT /burnout
GET  /mood/summary/monthly     ← NOT /monthly-summary
GET  /mood/insights/daily      ← NOT /insights
GET  /mood/trends/weekly       ← NOT /weekly
GET  /mood/trends/rolling      ← NOT /rolling
GET  /mood/sentiment/trends
GET  /mood/forecast
```

### Mood Score System

```
1 → bg-red-900/60     text-red-400     😞  "Very Low"
2 → bg-orange-900/60  text-orange-400  😕  "Low"
3 → bg-yellow-900/60  text-yellow-400  😐  "Okay"
4 → bg-emerald-900/60 text-emerald-400 😊  "Good"
5 → bg-emerald-600/80 text-emerald-300 😄  "Excellent"
0 → bg-gray-800                            (no data)
```

---

## 🧘 Habits Module — Phase 10 Complete

### All Components

| Component            | Route                  | Key Features                                                                          |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `HabitDashboard`     | `/app/habits`          | Stats row (active/done today/streak/archived), DnD list, free plan gate, create modal |
| `HabitList`          | —                      | DragDropContext + Droppable, passes onCompleted/onUndone callbacks to each HabitCard  |
| `HabitCard`          | —                      | Icon, category/frequency badges, complete/undo buttons, edit/delete, milestone toast  |
| `HabitForm`          | Modal (create + edit)  | Zod validation, icon picker, color swatches, reminder toggle, split update endpoints  |
| `HabitDetailPage`    | `/app/habits/:id`      | Done Today button, 2-col layout (analytics + log left, calendar + heatmap right)      |
| `HabitAnalyticsCard` | —                      | DonutChart (consistency %), completion rate, streaks, missed periods, best day        |
| `HabitCalendar`      | —                      | Monthly grid, prev/next nav, green = completed, today highlighted                     |
| `HabitHeatmap`       | —                      | 365-day GitHub-style grid, maps data.heatmap array correctly                          |
| `HabitLogHistory`    | —                      | Paginated 10/page, uses data.logs + data.totalPages                                   |
| `ArchivedHabits`     | `/app/habits/archived` | Restore + permanent delete with confirmation                                          |
| `MilestoneToast`     | —                      | Streak milestones at 7/14/21/30/60/90/100/180/365 days via react-hot-toast            |

### Backend API URLs (all verified)

```
POST   /habits                     ← Create (includes reminderOn/reminderTime)
GET    /habits                     ← All active habits
GET    /habits/archived            ← MUST be before /:id in router
PATCH  /habits/reorder             ← body: { habits: [{ id, sortOrder }] } NOT a bare array
PATCH  /habits/:id                 ← Habit fields ONLY (title, freq, category, color, icon, targetPerWeek)
PATCH  /habits/:id/reminder        ← Reminder fields ONLY (reminderOn, reminderTime) — SEPARATE endpoint!
DELETE /habits/:id                 ← Soft delete (archive)
PATCH  /habits/:id/restore
POST   /habits/:id/complete
DELETE /habits/:id/complete        ← Undo (current period only)
GET    /habits/:id/streak
GET    /habits/:id/analytics
GET    /habits/:id/summary         ← { month, completionsThisMonth, completionRate, calendar[] }
GET    /habits/:id/heatmap         ← { heatmap: [{ date, completed: 0|1 }] }
GET    /habits/:id/logs            ← { logs[], total, page, limit, totalPages }
```

### API Response Shapes — Critical Mappings

```ts
// Complete habit response:
// { message, log: { id, date, note }, currentStreak, milestone: { days, message } | null }
// ← log.date NOT log.createdAt

// Paginated logs:
// { logs: HabitLogEntry[], total, page, limit, totalPages }
// ← NOT { data, pagination } — use data.logs and data.totalPages directly

// Heatmap:
// { heatmap: [{ date: string, completed: 0 | 1 }] }
// ← Map: data.heatmap.map(d => ({ date: d.date, value: d.completed }))

// Monthly calendar:
// { month, completionsThisMonth, completionRate, calendar: [{ date, completed: boolean }] }
// ← Filter: data.calendar.filter(d => d.completed).map(d => d.date) → Set<string>

// Reorder payload:
// { habits: [{ id, sortOrder }] }  ← MUST wrap in object, NOT a bare array
```

### Key Implementation Notes

**completedTodayIds tracking** — `GET /habits` does NOT return `isCompletedToday`. Tracked as `useState<Set<string>>` in `HabitDashboard`, updated via `onCompleted(id)` / `onUndone(id)` callbacks passed through `HabitList` → `HabitCard`.

**Split update endpoints** — `PATCH /habits/:id` and `PATCH /habits/:id/reminder` are two completely separate backend routes. `HabitForm` calls them sequentially on edit:

1. `updateHabit({ id, body: { title, frequency, category, color, icon, targetPerWeek } })`
2. `updateReminder({ id, body: { reminderOn, reminderTime? } })`

Sending `reminderOn` to `PATCH /:id` causes a 400 validation error from the backend.

**Modal scroll architecture** — `Modal.tsx` uses a fixed overlay + `flex-col` panel (`max-h-[90vh]`). Body is `flex-1 overflow-y-auto` so the modal scrolls internally (not the page). Form footer uses `sticky bottom-0 bg-gray-900` so Cancel/Save buttons are always visible.

**Reminder system** — `reminderOn + reminderTime` saved to backend. Backend cron job runs every minute and sends Gmail SMTP reminder emails at stored time. Already completed habits are silently skipped.

### Bugs Fixed During Phase 10

| Bug                               | Root Cause                                                                         | Fix                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Edit habit silent fail (400)      | `onSubmit` calling `updateHabit` twice — second call hit duplicate name check      | Removed duplicate call                                     |
| Edit habit validation error (400) | `reminderOn` sent to `PATCH /:id` which rejects it                                 | Split into two sequential calls                            |
| Save Changes button not clickable | Modal overlay was scrolling the page — footer rendered outside viewport click area | Fixed overlay + internal modal scroll + sticky footer      |
| HabitLogHistory wrong data shape  | Using `data.data` and `data.pagination.totalPages`                                 | Fixed to `data.logs` and `data.totalPages`                 |
| HabitCalendar wrong data shape    | Using `data.completedDates`                                                        | Fixed to filter `data.calendar` where `completed === true` |
| HabitHeatmap wrong data shape     | Passing `data` directly to HeatmapGrid                                             | Fixed to map `data.heatmap` → `{ date, value }`            |
| Reorder 400 error                 | Sending bare array to reorder endpoint                                             | Wrapped in `{ habits: [...] }` object                      |
| Hard refresh redirect to login    | Reading `refreshToken` from Redux (not yet hydrated)                               | Read directly from `localStorage.getItem('refreshToken')`  |

---

## 🔒 Plan-Aware UI

### `usePlanGate(resource)` hook

```ts
const { canAccess, requiredPlan, currentPlan } = usePlanGate("habit_create");
```

### Plan Limits

| Resource         | Free                         | Pro       | Enterprise |
| ---------------- | ---------------------------- | --------- | ---------- |
| `habit_create`   | Max 3 active habits          | Unlimited | Unlimited  |
| `mood_history`   | 30 days (clamped by backend) | Full      | Full       |
| `ai_insights`    | ❌                           | ✅        | ✅         |
| `ai_suggestions` | ❌                           | ✅        | ✅         |
| `ai_chat`        | ❌                           | ✅        | ✅         |
| `team_features`  | ❌                           | ❌        | ✅         |

When free user hits habit limit: `HabitDashboard` shows `UpgradeBanner` instead of create button. Backend also enforces via `checkPlanLimit("habit_create")` middleware (returns 403).

---

## 🤖 Phase 11 — AI Insights + Billing + Gamification (BUILD NEXT)

### AI Features (Pro/Enterprise only)

| Component          | Backend Endpoint      | Features                                                                      |
| ------------------ | --------------------- | ----------------------------------------------------------------------------- |
| `AiInsightsPage`   | `GET /ai/insights`    | Cross-correlated behavioral insights, SHA-256 cached, `?refresh=true` support |
| `InsightCard`      | —                     | type badge + severity chip + title + description                              |
| `SuggestionsPanel` | `GET /ai/suggestions` | 3 personalized habit suggestions with rationale + expectedMoodImpact          |
| `AiChatPage`       | `POST /ai/chat`       | Conversational coach, `conversationId` threading, 90-day behavioral context   |
| `AiPlanGate`       | —                     | Blurred fake cards + "Upgrade to Pro" CTA for Free users                      |

**Insight types:** `correlation | streak | warning | positive | suggestion`
**Severity:** `info (blue) | warning (amber) | success (green)`

**AI Chat conversationId flow:**

```
First call: no conversationId → backend creates thread → returns conversationId
Subsequent calls: pass conversationId → continues same thread (last 10 messages sent to Groq)
Store conversationId in component state or localStorage
```

### Cross-Module Analytics (Phase 11)

| Component         | Backend Endpoint              | Features                                                     |
| ----------------- | ----------------------------- | ------------------------------------------------------------ |
| `CorrelationPage` | `GET /analytics/correlation`  | Mood ↔ habit lift per habit — completionDayAvg vs skipDayAvg |
| `HabitMatrixPage` | `GET /analytics/habit-matrix` | Co-completion rate for every habit pair with suggestions     |

### Notifications (Phase 11)

| Component            | Backend Endpoint                  | Features                                                 |
| -------------------- | --------------------------------- | -------------------------------------------------------- |
| `NotificationBell`   | `GET /notifications/unread-count` | Badge count in Topbar, auto-polls every 30s              |
| `NotificationDrawer` | `GET /notifications` + mark-read  | Paginated list, unread first, deep-links via `relatedId` |

**Notification types to handle in UI:**

| Type                   | Deep-link Target       |
| ---------------------- | ---------------------- |
| `STREAK_MILESTONE`     | `/app/habits/:habitId` |
| `BADGE_EARNED`         | `/app/badges`          |
| `CHALLENGE_UPDATE`     | `/app/challenges/:id`  |
| `WEEKLY_SUMMARY`       | `/app/dashboard`       |
| `BURNOUT_RISK_CHANGED` | `/app/mood/burnout`    |
| `MOOD_REMINDER`        | `/app/mood`            |
| `HABIT_REMINDER`       | `/app/habits`          |

### Badges (Phase 11)

| Component        | Backend Endpoint | Features                                                  |
| ---------------- | ---------------- | --------------------------------------------------------- |
| `BadgeShelfPage` | `GET /badges`    | Earned (with dates) + locked (with hints), 6 total badges |

**Badge types:**

| Badge            | Unlock Condition                            |
| ---------------- | ------------------------------------------- |
| 🌱 First Step    | Log your first mood entry                   |
| 🔥 Week One      | 7-day consecutive mood logging streak       |
| 💪 Iron Will     | 30-day streak on any single habit           |
| 🧘 Mindful Month | Log mood every day of a full calendar month |
| 🌸 Resilient     | Burnout risk drops from High → Low          |
| 🏅 Centurion     | 100-day streak on any single habit          |

### Challenges (Phase 11)

| Component         | Features                                                                        |
| ----------------- | ------------------------------------------------------------------------------- |
| `ChallengesPage`  | Browse public challenges, create (habit-linked or free-form), join via joinCode |
| `ChallengeCard`   | Title, targetDays, participant count, active status, joinCode for private       |
| `LeaderboardPage` | Ranked by completions, `isMe` flag highlights current user                      |

**Two challenge types:**

- **Habit-linked** — progress auto-advances when linked habit is completed
- **Free-form** — participant manually calls `POST /challenges/:id/complete`

### Community Feed (Phase 11)

| Component           | Features                                                               |
| ------------------- | ---------------------------------------------------------------------- |
| `CommunityFeedPage` | Public feed (no auth required), sort by newest/popular, filter by type |
| `CreatePostModal`   | type: MILESTONE or REFLECTION, content 10–500 chars, up to 5 tags      |

**Anonymity note:** posts are anonymous by design — backend strips all identity. No `userId` is ever stored on post documents. Upvote deduplication uses irreversible HMAC-SHA256.

### Billing — Razorpay Flow

```
1. POST /billing/order { plan: 'pro' } → { orderId, amount, currency, keyId }
2. Dynamically load Razorpay SDK → open popup
3. User pays → handler({ razorpayPaymentId, razorpayOrderId, razorpaySignature })
4. POST /billing/verify { ...ids, plan } → { success: true, plan: 'pro' }
5. dispatch(updateUserPlan('pro')) → all plan gates update instantly across entire app
```

| Component          | Features                                                         |
| ------------------ | ---------------------------------------------------------------- |
| `BillingPage`      | Current plan, renewal date, manage + cancel subscription         |
| `PricingPlans`     | Free vs Pro vs Enterprise cards with feature lists + CTA buttons |
| `RazorpayCheckout` | Creates order → loads SDK → opens popup → verify → dispatch plan |
| `UpgradeBanner`    | Inline banner shown inside plan-gated features, links to billing |

---

## 🔒 Security Notes

- Access tokens **never in localStorage** — Redux in-memory only (XSS safe)
- Refresh tokens in `localStorage` — cleared on logout + reuse detection kills all sessions
- All requests via `baseQueryWithReauth` — no scattered token handling anywhere
- `RAZORPAY_KEY_SECRET` backend only — never in frontend env
- `VITE_` env vars bundled into client build — never put secrets here
- Community posts are anonymous — no userId sent or displayed anywhere in UI

---

## 📋 Build Progress

### ✅ Completed

| Phase | Built                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Vite + React + TS scaffold, Tailwind dark theme, brand colors, `@/*` alias, folder structure                                             |
| 2     | All TypeScript types — auth, mood, habit, ai, analytics, notifications, badges, challenges, community, billing                           |
| 3     | Redux store + authSlice (accessToken in memory, refreshToken in localStorage, plan) + typed hooks                                        |
| 4     | RTK Query baseApi with 401 interceptor + all API slices                                                                                  |
| 5     | 10 shared UI components — Button, Input, Textarea, Badge, Modal, Spinner, Skeleton, Tabs, Tooltip, EmptyState                            |
| 6     | Layout — AuthLayout, Sidebar, Topbar, AppLayout (mobile drawer + backdrop + auto-close)                                                  |
| 7     | Router (all routes), ProtectedRoute (localStorage direct read), utility hooks + utils                                                    |
| 8     | All 5 auth pages with Zod + password show/hide Eye toggle                                                                                |
| 9a    | Mood module — DashboardPage, MoodDashboard, MoodLogForm, MoodHistory, MoodTrendChart, MoodInsights, BurnoutRiskCard + 4 chart components |
| 9b    | MoodForecast + MoodSentiment (sentiment trends + divergence table)                                                                       |
| 9c    | Bug fixes — wrong API URLs, BurnoutRiskCard crash, MoodInsights crash, HeatmapGrid tooltip clipping, hard refresh redirect               |
| 10    | Habits module — all 11 components + DnD reorder + split update endpoints + Modal scroll fix + all API shape fixes                        |

### 🔜 Remaining

| Phase  | To Build                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **11** | **AI (Insights, Suggestions, Chat, PlanGate) + Analytics (Correlation, HabitMatrix) + Notifications + Badges + Challenges + Community + Billing (Razorpay)** |
| 12     | ProfilePage (preferences: mood reminder toggle, weekly digest toggle) + Error boundaries + 404 page + final polish                                           |

---

## 🔗 Backend Reference

Swagger UI: `http://localhost:5000/api-docs`

| Module        | Endpoints  | Frontend Phase | Notes                                                                 |
| ------------- | ---------- | -------------- | --------------------------------------------------------------------- |
| Auth          | 9 (+prefs) | ✅ Done        | Dual-token JWT, OTP, rotation, reuse detection                        |
| Mood          | 15         | ✅ Done        | Analytics, burnout risk, heatmap, forecast, sentiment trends          |
| Habits        | 15         | ✅ Done        | Streak engine, milestone detection, DnD reorder, email reminders      |
| Notifications | 4          | 🔜 Phase 11    | Unread count + paginated list + mark read                             |
| Analytics     | 2          | 🔜 Phase 11    | Mood ↔ habit lift, co-completion matrix                               |
| AI            | 3          | 🔜 Phase 11    | Insights (cached), suggestions (cached), coach chat (MongoDB history) |
| Badges        | 1          | 🔜 Phase 11    | 6 badges, earned + locked shelf                                       |
| Challenges    | 7          | 🔜 Phase 11    | Public/private, habit-linked, leaderboard                             |
| Community     | 3          | 🔜 Phase 11    | Anonymous feed, HMAC upvote deduplication                             |
| Billing       | 5          | 🔜 Phase 11    | Razorpay order + verify + webhook + cancel                            |

---

_Last updated: March 2026 — Phases 1–10 complete. Phase 11 (AI + Notifications + Badges + Challenges + Community + Billing) is next._
