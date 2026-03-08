# 🌸 PulseBloom Frontend

> **React + TypeScript + Vite** — Behavioral analytics platform frontend with mood tracking, habit building, AI insights, subscription billing, challenges, community feed, and badge system.
>
> **Current Status: All Phases 1–12 Complete. ✅**

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
│   │   ├── authApi.ts                  ✅ 11 auth endpoints (incl. preferences + changePassword)
│   │   ├── moodApi.ts                  ✅ 15 mood endpoints (all URLs verified)
│   │   ├── habitApi.ts                 ✅ 15 habit endpoints (all URLs verified)
│   │   ├── aiApi.ts                    ✅ 3 AI endpoints (insights, suggestions, chat)
│   │   ├── analyticsApi.ts             ✅ 2 cross-module analytics endpoints
│   │   ├── notificationApi.ts          ✅ 4 notification endpoints
│   │   ├── badgeApi.ts                 ✅ 1 badge shelf endpoint
│   │   ├── challengeApi.ts             ✅ 7 challenge endpoints
│   │   ├── communityApi.ts             ✅ 3 community feed endpoints
│   │   └── billingApi.ts               ✅ 5 Razorpay billing endpoints
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts            ✅ User, tokens, plan, preferences state
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
│   │   │   ├── AiInsightsPage.tsx      ✅ Insights grid + SuggestionsPanel + Talk to AI Coach button
│   │   │   ├── InsightCard.tsx         ✅ type badge + severity chip + left border color
│   │   │   ├── SuggestionsPanel.tsx    ✅ 3 suggestions + refresh + cached badge
│   │   │   ├── AiChatPage.tsx          ✅ Chat UI, conversationId in localStorage, starter prompts
│   │   │   └── AiPlanGate.tsx          ✅ Blurred overlay + upgrade CTA for free users
│   │   │
│   │   ├── analytics/
│   │   │   ├── CorrelationPage.tsx     ✅ Bar chart completion vs skip + lift badges + detail cards
│   │   │   └── HabitMatrixPage.tsx     ✅ Color-coded grid + pair cards + co-completion %
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationBell.tsx    ✅ Unread badge (polls 30s), opens drawer
│   │   │   └── NotificationDrawer.tsx  ✅ Slide-in, mark read, deep-links, load more
│   │   │
│   │   ├── badges/
│   │   │   └── BadgeShelfPage.tsx      ✅ Earned + locked badges with progress bar
│   │   │
│   │   ├── challenges/
│   │   │   ├── ChallengesPage.tsx      ✅ Browse/My Progress/Created tabs + create modal
│   │   │   ├── ChallengeCard.tsx       ✅ Browse/Joined/Mine card variants + share panel
│   │   │   ├── LeaderboardPage.tsx     ✅ Ranked table, crown/medal icons, isMe highlight
│   │   │   └── JoinChallengePage.tsx   ✅ Public invite link handler (/join?code=XXXXXXXX)
│   │   │
│   │   ├── community/
│   │   │   ├── CommunityFeedPage.tsx   ✅ Anonymous feed + sort + type filter + upvote + pagination
│   │   │   └── CreatePostModal.tsx     ✅ Type selector + textarea + tag input + anonymity notice
│   │   │
│   │   ├── billing/
│   │   │   ├── BillingPage.tsx         ✅ Current plan card + cancel modal + pricing
│   │   │   ├── PricingPlans.tsx        ✅ Free/Pro/Enterprise cards, ₹299/₹799, feature rows
│   │   │   ├── RazorpayCheckout.tsx    ✅ Dynamic SDK load + order + verify + dispatch plan
│   │   │   └── UpgradeBanner.tsx       ✅ Compact + full variants, dismissible
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx         ✅ Account info + password change + preferences
│   │   │   └── PreferencesForm.tsx     ✅ Mood reminder toggle + time picker + weekly digest
│   │   │
│   │   └── errors/
│   │       └── NotFoundPage.tsx        ✅ 404 page with back + dashboard nav
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
│   │   │   ├── Sidebar.tsx             ✅ Nav links incl. Analytics/Badges/Challenges/Community/Profile
│   │   │   ├── Topbar.tsx              ✅ NotificationBell + all page titles wired
│   │   │   └── AuthLayout.tsx          ✅ Centered card, background glows
│   │   │
│   │   ├── ErrorBoundary.tsx           ✅ Catches React crashes, refresh CTA
│   │   │
│   │   └── charts/
│   │       ├── HeatmapGrid.tsx         ✅ Fixed-position tooltip (z-9999), never clipped
│   │       ├── LineChart.tsx           ✅ Multi-line, dark styled, ResponsiveContainer
│   │       ├── BarChart.tsx            ✅ Color function support, dark styled
│   │       └── DonutChart.tsx          ✅ Centre label, configurable color + size
│   │
│   ├── hooks/
│   │   ├── usePlanGate.ts              ✅ Resources: habit_create, mood_history, ai_insights,
│   │   │                                   ai_suggestions, ai_chat, team_features
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
│   │   ├── ai.types.ts                 ✅ AiInsight, InsightType, InsightSeverity, AiSuggestion,
│   │   │                                   AiChatMessage, AiSuggestionsResponse, AiChatResponse
│   │   ├── analytics.types.ts          ✅ CorrelationResult, CorrelationResponse,
│   │   │                                   HabitPairResult, HabitMatrixResponse
│   │   ├── notification.types.ts       ✅ Notification, NotificationType, UnreadCountResponse
│   │   ├── badge.types.ts              ✅ Badge, BadgeType, BadgeShelfResponse
│   │   ├── challenge.types.ts          ✅ Challenge, JoinedChallenge, ChallengeProgress,
│   │   │                                   LeaderboardEntry, LeaderboardResponse + all request/response types
│   │   ├── community.types.ts          ✅ CommunityPost, PostType, FeedResponse,
│   │   │                                   CreatePostRequest, UpvoteResponse
│   │   └── billing.types.ts            ✅ Plan, Subscription, BillingStatus, CreateOrderRequest,
│   │                                       CreateOrderResponse, VerifyPaymentRequest,
│   │                                       VerifyPaymentResponse, PLAN_FEATURES (₹299/₹799)
│   │
│   ├── router/
│   │   └── index.tsx                   ✅ All routes wired — including /join (public invite link)
│   │                                       and * → NotFoundPage (real 404)
│   │
│   ├── App.tsx                         ✅ RouterProvider + ErrorBoundary + dark Toaster
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
- **Error boundary** — `ErrorBoundary` wraps the entire app; crash → friendly reload screen
- **Real 404** — unknown routes show `NotFoundPage` instead of redirecting to `/login`

---

## 🔐 Authentication — Complete

### Token Strategy

| Token          | Storage           | Lifetime | Reason                  |
| -------------- | ----------------- | -------- | ----------------------- |
| `accessToken`  | Redux memory only | 15 min   | Never in DOM → XSS safe |
| `refreshToken` | `localStorage`    | 7 days   | Survives page refresh   |

### authSlice Actions

```typescript
setCredentials(TokenResponse); // login / OTP verify — sets user + tokens + localStorage
updateAccessToken(TokenResponse); // 401 refresh — updates token without clearing user
updateUserPlan(Plan); // billing upgrade/cancel — updates plan in Redux instantly
updateUserPreferences(Preferences); // profile save — updates preferences in Redux instantly
logout(); // clears all state + localStorage
```

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

6. Password change:
   PATCH /auth/me/password → backend revokes all refresh tokens
   → frontend dispatches logout() after 1.5s → /login
```

### IMPORTANT: Backend must return `plan` in login/refresh response

```typescript
// Backend login + refresh responses MUST include plan field:
{
  user: { id, email, name, isVerified, plan },  // ← plan REQUIRED
  accessToken,
  refreshToken,
  accessTokenExpiresIn
}
```

---

## 🔌 RTK Query — All API Slices

### baseApi.ts — Cache Tag Types

```typescript
tagTypes: [
  "MoodEntry",
  "MoodAnalytics",
  "MoodStreak",
  "MoodHeatmap",
  "MoodSummary",
  "MoodInsights",
  "MoodTrends",
  "MoodRolling",
  "BurnoutRisk",
  "Habit",
  "HabitLog",
  "HabitStreak",
  "HabitAnalytics",
  "HabitSummary",
  "HabitHeatmap",
  "AiInsights",
  "BillingStatus",
  "Badge", // badgeApi
  "Notification", // notificationApi
  "Challenge", // public browse list
  "MyChallenge", // challenges I created
  "JoinedChallenge", // challenges I joined
  "ChallengeLeaderboard", // per-challenge leaderboard
  "CommunityFeed", // community feed
  "UserProfile", // getMe + updatePreferences
];
```

### Auth API — `authApi.ts` (11 endpoints)

```ts
useRegisterMutation;
useVerifyEmailMutation;
useResendVerificationMutation;
useLoginMutation;
useRefreshTokenMutation;
useLogoutMutation;
useGetMeQuery; // GET  /auth/me — providesTags: ["UserProfile"]
useForgotPasswordMutation;
useResetPasswordMutation;
useUpdatePreferencesMutation; // PATCH /auth/me/preferences
useChangePasswordMutation; // PATCH /auth/me/password — sends { currentPassword, newPassword, confirmPassword }
```

### Mood API — `moodApi.ts` (15 endpoints)

```ts
useCreateMoodMutation;
useGetMoodsQuery; // GET /mood (+ planLimitApplied in response)
useGetMoodByIdQuery;
useUpdateMoodMutation;
useDeleteMoodMutation;
useGetMoodAnalyticsQuery;
useGetMoodStreakQuery;
useGetMoodHeatmapQuery;
useGetMoodMonthlySummaryQuery;
useGetMoodDailyInsightsQuery;
useGetWeeklyTrendsQuery;
useGetRollingAverageQuery;
useGetBurnoutRiskQuery;
useGetSentimentTrendsQuery;
useGetMoodForecastQuery;
```

### Habit API — `habitApi.ts` (15 endpoints)

```ts
useCreateHabitMutation;
useGetHabitsQuery;
useGetArchivedHabitsQuery;
useUpdateHabitMutation; // PATCH /habits/:id — habit fields ONLY
useUpdateReminderMutation; // PATCH /habits/:id/reminder — SEPARATE endpoint!
useDeleteHabitMutation;
useRestoreHabitMutation;
useReorderHabitsMutation; // body: { habits: [{ id, sortOrder }] }
useCompleteHabitMutation;
useUndoCompletionMutation;
useGetHabitStreakQuery;
useGetHabitAnalyticsQuery;
useGetHabitMonthlySummaryQuery;
useGetHabitHeatmapQuery;
useGetHabitLogsQuery;
```

### AI API — `aiApi.ts` (3 endpoints)

```ts
useGetAiInsightsQuery; // GET /ai/insights(?refresh=true) — Pro/Enterprise only
useGetAiSuggestionsQuery; // GET /ai/suggestions(?refresh=true) — Pro/Enterprise only
useSendAiChatMutation; // POST /ai/chat { message, conversationId? }
```

**AI Chat conversationId flow:**

```
First call: omit conversationId → backend creates thread → returns conversationId
Subsequent: pass conversationId → continues same thread (last 10 messages to Groq)
Stored in localStorage key: "pb_ai_conversation_id"
Clear on "New conversation" button
```

### Analytics API — `analyticsApi.ts` (2 endpoints)

```ts
useGetCorrelationQuery; // GET /analytics/correlation
useGetHabitMatrixQuery; // GET /analytics/habit-matrix
```

### Notifications API — `notificationApi.ts` (4 endpoints)

```ts
useGetNotificationsQuery;
useGetUnreadCountQuery; // polls every 30s via pollingInterval: 30_000
useMarkNotificationReadMutation;
useMarkAllReadMutation;
```

**Deep-link map:**
| Type | Navigate to |
|---|---|
| `STREAK_MILESTONE` | `/app/habits/:relatedId` |
| `BADGE_EARNED` | `/app/badges` |
| `CHALLENGE_UPDATE` | `/app/challenges/:relatedId` |
| `WEEKLY_SUMMARY` | `/app/dashboard` |
| `BURNOUT_RISK_CHANGED` | `/app/mood/burnout` |
| `MOOD_REMINDER` | `/app/mood` |
| `HABIT_REMINDER` | `/app/habits` |

### Badges API — `badgeApi.ts` (1 endpoint)

```ts
useGetBadgeShelfQuery; // GET /badges — earned (with dates) + locked (with hints)
```

**Response shape:**

```typescript
{
  earned: [{ id, type, relatedId, earnedAt }],
  locked: [{ type, hint }]
}
```

**Badge types:**
| Badge | Type | Unlock Condition |
|-------|------|-----------------|
| 🌱 First Step | `FIRST_STEP` | Log your first mood entry |
| 🔥 Week One | `WEEK_ONE` | 7-day consecutive mood logging streak |
| 💪 Iron Will | `IRON_WILL` | 30-day streak on any single habit |
| 🧘 Mindful Month | `MINDFUL_MONTH` | Log mood every day of a full calendar month |
| 🌸 Resilient | `RESILIENT` | Burnout risk drops from High → Low |
| 🏅 Centurion | `CENTURION` | 100-day streak on any single habit |

### Challenges API — `challengeApi.ts` (7 endpoints)

```ts
useGetChallengesQuery; // GET  /challenges?page&limit&active
useCreateChallengeMutation; // POST /challenges
useGetMyChallengesQuery; // GET  /challenges/mine
useGetJoinedChallengesQuery; // GET  /challenges/joined (includes progress per challenge)
useJoinChallengeMutation; // POST /challenges/:id/join { joinCode? }
useCompleteChallengeDayMutation; // POST /challenges/:id/complete (free-form only)
useGetLeaderboardQuery; // GET  /challenges/:id/leaderboard
```

**Private challenge sharing flow:**

```
Creator creates private challenge → sees joinCode in "Created by Me" tab
  → Copy Code button: copies 8-char code (e.g. A3F9E201)
  → Copy Link button: copies full URL (e.g. http://localhost:3000/join?code=A3F9E201)
Recipient opens link → /join?code=A3F9E201
  → Auto-joins if authenticated
  → Redirects to /login?redirect=/join?code=... if not authenticated
  → Returns to /join after login to complete joining
```

### Community API — `communityApi.ts` (3 endpoints)

```ts
useGetCommunityFeedQuery; // GET  /community?sort&type&tag&page&limit
useCreateCommunityPostMutation; // POST /community { type, content, tags[] }
useToggleUpvoteMutation; // POST /community/:id/upvote (toggle)
```

### Billing API — `billingApi.ts` (5 endpoints)

```ts
useCreateOrderMutation;
useVerifyPaymentMutation;
useGetBillingStatusQuery;
useCancelSubscriptionMutation;
```

**Razorpay flow:**

```
1. useCreateOrderMutation({ plan }) → { orderId, amount, currency, keyId }
2. Load SDK: https://checkout.razorpay.com/v1/checkout.js (dynamic script tag)
3. new window.Razorpay({ key: keyId, order_id: orderId, ... }).open()
4. handler({ razorpay_payment_id, razorpay_order_id, razorpay_signature })
5. useVerifyPaymentMutation({ razorpayOrderId, razorpayPaymentId, razorpaySignature, plan })
6. dispatch(updateUserPlan(result.plan)) → all plan gates update instantly
```

### Cache Tag Invalidation

| Tag                    | Invalidated by                                                     |
| ---------------------- | ------------------------------------------------------------------ |
| `MoodEntry`            | createMood, updateMood, deleteMood                                 |
| `MoodAnalytics`        | createMood, updateMood, deleteMood                                 |
| `MoodStreak`           | createMood, deleteMood                                             |
| `MoodHeatmap`          | createMood, updateMood, deleteMood                                 |
| `MoodSummary`          | createMood, updateMood, deleteMood                                 |
| `BurnoutRisk`          | createMood, deleteMood                                             |
| `Habit`                | createHabit, updateHabit, deleteHabit, reorderHabits, restoreHabit |
| `HabitLog`             | completeHabit, undoCompletion                                      |
| `HabitStreak`          | completeHabit, undoCompletion                                      |
| `HabitAnalytics`       | completeHabit, undoCompletion                                      |
| `HabitHeatmap`         | completeHabit, undoCompletion                                      |
| `Notification`         | markRead, markAllRead                                              |
| `BillingStatus`        | verifyPayment, cancelSubscription                                  |
| `AiInsights`           | (manual refresh only via ?refresh=true param)                      |
| `Challenge`            | createChallenge, joinChallenge                                     |
| `MyChallenge`          | createChallenge                                                    |
| `JoinedChallenge`      | joinChallenge, completeChallengeDay                                |
| `ChallengeLeaderboard` | completeChallengeDay                                               |
| `CommunityFeed`        | createCommunityPost, toggleUpvote                                  |
| `UserProfile`          | updatePreferences                                                  |

---

## 🛣️ All Routes

| Route                   | Component          | Auth | Notes                             |
| ----------------------- | ------------------ | ---- | --------------------------------- |
| `/`                     | → `/app/dashboard` | ❌   | Redirect                          |
| `/register`             | RegisterPage       | ❌   |                                   |
| `/verify-email`         | VerifyEmailPage    | ❌   |                                   |
| `/login`                | LoginPage          | ❌   |                                   |
| `/forgot-password`      | ForgotPasswordPage | ❌   |                                   |
| `/reset-password`       | ResetPasswordPage  | ❌   |                                   |
| `/join`                 | JoinChallengePage  | ❌   | Auto-joins via `?code=` param     |
| `/404`                  | NotFoundPage       | ❌   |                                   |
| `/app/dashboard`        | DashboardPage      | ✅   |                                   |
| `/app/mood`             | MoodDashboard      | ✅   |                                   |
| `/app/mood/history`     | MoodHistory        | ✅   |                                   |
| `/app/mood/trends`      | MoodTrendChart     | ✅   |                                   |
| `/app/mood/insights`    | MoodInsights       | ✅   |                                   |
| `/app/mood/burnout`     | BurnoutRiskCard    | ✅   |                                   |
| `/app/mood/forecast`    | MoodForecast       | ✅   |                                   |
| `/app/mood/sentiment`   | MoodSentiment      | ✅   |                                   |
| `/app/habits`           | HabitDashboard     | ✅   |                                   |
| `/app/habits/archived`  | ArchivedHabits     | ✅   |                                   |
| `/app/habits/:id`       | HabitDetailPage    | ✅   |                                   |
| `/app/ai`               | AiInsightsPage     | ✅   | Pro/Enterprise only               |
| `/app/ai/chat`          | AiChatPage         | ✅   | Pro/Enterprise only               |
| `/app/analytics`        | CorrelationPage    | ✅   |                                   |
| `/app/analytics/matrix` | HabitMatrixPage    | ✅   |                                   |
| `/app/badges`           | BadgeShelfPage     | ✅   |                                   |
| `/app/challenges`       | ChallengesPage     | ✅   |                                   |
| `/app/challenges/:id`   | LeaderboardPage    | ✅   |                                   |
| `/app/community`        | CommunityFeedPage  | ✅   |                                   |
| `/app/billing`          | BillingPage        | ✅   |                                   |
| `/app/profile`          | ProfilePage        | ✅   |                                   |
| `*`                     | NotFoundPage       | ❌   | Real 404 (not redirect to /login) |

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
| Mobile `< lg` | Drawer (hamburger toggle + backdrop) | 1–2 col | `p-4`   |
| Desktop `lg+` | Always visible `w-64`                | 2–4 col | `p-6`   |

### Component Quick Reference

```
Button     → variant: primary|secondary|ghost|destructive|outline
           → size: sm|md|lg, loading, fullWidth

Badge      → variant: default|success|warning|danger|info|purple
           → size: sm|md

Modal      → size: sm|md|lg|xl  ← prop is "isOpen" (not "open")
           → Fixed overlay (never page-scrolls), flex-col panel, max-h-[90vh]
           → Body: flex-1 overflow-y-auto (modal scrolls internally)
           → Footer: sticky bottom-0 bg-gray-900 (always visible and clickable)

EmptyState → icon?, title, description?, action?: { label, onClick }

UpgradeBanner → compact?: boolean, dismissible?: boolean, message?: string
              → Two variants: compact (inline) and full (card with icon)
```

> ⚠️ **Modal prop is `isOpen`, NOT `open`** — passing `open` silently renders nothing.

---

## 🔒 Plan-Aware UI

### `usePlanGate(resource)` hook

```ts
const { canAccess, requiredPlan, currentPlan } = usePlanGate("ai_insights");
```

### Resource → Plan Requirements

| Resource         | Free                         | Pro       | Enterprise |
| ---------------- | ---------------------------- | --------- | ---------- |
| `habit_create`   | Max 3 active habits          | Unlimited | Unlimited  |
| `mood_history`   | 30 days (clamped by backend) | Full      | Full       |
| `ai_insights`    | ❌ (AiPlanGate overlay)      | ✅        | ✅         |
| `ai_suggestions` | ❌ (AiPlanGate overlay)      | ✅        | ✅         |
| `ai_chat`        | ❌ (AiPlanGate overlay)      | ✅        | ✅         |
| `team_features`  | ❌                           | ❌        | ✅         |

---

## 📊 Mood Module — Complete

### Backend API URLs (all verified)

```
POST   /mood
GET    /mood                    ← planLimitApplied in response for free users
GET    /mood/:id
PATCH  /mood/:id
DELETE /mood/:id
GET    /mood/streak
GET    /mood/heatmap
GET    /mood/analytics
GET    /mood/burnout-risk        ← NOT /burnout
GET    /mood/summary/monthly     ← NOT /monthly-summary
GET    /mood/insights/daily      ← NOT /insights
GET    /mood/trends/weekly       ← NOT /weekly
GET    /mood/trends/rolling      ← NOT /rolling
GET    /mood/sentiment/trends
GET    /mood/forecast
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

## 🧘 Habits Module — Complete

### Backend API URLs (all verified)

```
POST   /habits
GET    /habits
GET    /habits/archived            ← MUST be before /:id in router
PATCH  /habits/reorder             ← body: { habits: [{ id, sortOrder }] } NOT a bare array
PATCH  /habits/:id                 ← Habit fields ONLY
PATCH  /habits/:id/reminder        ← Reminder fields ONLY — SEPARATE endpoint!
DELETE /habits/:id
PATCH  /habits/:id/restore
POST   /habits/:id/complete
DELETE /habits/:id/complete
GET    /habits/:id/streak
GET    /habits/:id/analytics
GET    /habits/:id/summary
GET    /habits/:id/heatmap
GET    /habits/:id/logs
```

### Critical API Response Shapes

```typescript
// Complete habit: { message, log: { id, date, note }, currentStreak, milestone | null }
// Logs: { logs[], total, page, limit, totalPages } ← NOT { data, pagination }
// Heatmap: { heatmap: [{ date, completed: 0|1 }] }
// Calendar: { month, completionsThisMonth, completionRate, calendar: [{ date, completed }] }
// Reorder: body must be { habits: [...] } NOT bare array
```

---

## ⚔️ Challenges Module — Complete

### Key Notes

- **Public challenges**: join by ID, no code needed
- **Private challenges**: creator shares 8-char `joinCode` or full `/join?code=` URL
- **Habit-linked**: progress auto-advances when linked habit is completed
- **Free-form**: participants manually call `POST /challenges/:id/complete`
- **Leaderboard**: sorted by `completionsCount` desc; ties broken by `completedAt` asc
- **`isMe` flag**: backend returns this so frontend can highlight current user's row

### Change Password — Important Backend Behaviour

```
PATCH /auth/me/password requires ALL THREE fields:
  { currentPassword, newPassword, confirmPassword }

On success:
  - All refresh tokens across all devices are REVOKED
  - No new tokens issued — client must re-login
  - Frontend auto-dispatches logout() after 1.5s
```

---

## 🌐 Community Module — Complete

### Key Notes

- GET /community is **public** — no auth required to browse
- POST /community and POST /community/:id/upvote **require auth** (spam prevention)
- Posts are **fully anonymous** — no userId stored, HMAC dedup for upvotes
- `hasUpvoted` flag only present in response when authenticated
- Upvote is **toggle** — call twice to remove

---

## 📋 Build Progress — All Phases Complete

| Phase | Built                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------ |
| 1     | Vite + React + TS scaffold, Tailwind dark theme, brand colors, `@/*` alias, folder structure     |
| 2     | All TypeScript types                                                                             |
| 3     | Redux store + authSlice + typed hooks                                                            |
| 4     | RTK Query baseApi with 401 interceptor + all API slices                                          |
| 5     | 10 shared UI components                                                                          |
| 6     | Layout — AuthLayout, Sidebar, Topbar, AppLayout                                                  |
| 7     | Router, ProtectedRoute, utility hooks + utils                                                    |
| 8     | All 5 auth pages                                                                                 |
| 9     | Full Mood module (8 pages + charts)                                                              |
| 10    | Full Habits module (11 components + DnD + all API fixes)                                         |
| 11a   | AI module (AiInsightsPage, InsightCard, SuggestionsPanel, AiChatPage, AiPlanGate)                |
| 11b   | Billing module (BillingPage, PricingPlans, RazorpayCheckout, UpgradeBanner)                      |
| 11c   | Notifications (NotificationBell + NotificationDrawer wired into Topbar)                          |
| 11d   | Analytics (CorrelationPage + HabitMatrixPage + analyticsApi + analytics.types)                   |
| 11e   | Sidebar updated with Analytics/Badges/Challenges/Community nav links                             |
| 11f   | Badges (BadgeShelfPage + badgeApi + badge.types)                                                 |
| 11g   | Challenges (ChallengesPage + ChallengeCard + LeaderboardPage + JoinChallengePage + challengeApi) |
| 11h   | Community (CommunityFeedPage + CreatePostModal + communityApi + community.types)                 |
| 12    | ProfilePage + PreferencesForm + ErrorBoundary + NotFoundPage + Topbar page titles + baseApi tags |

---

## 🔗 Backend Reference

Swagger UI: `http://localhost:5000/api-docs`

| Module        | Endpoints | Frontend Status | Notes                                                  |
| ------------- | --------- | --------------- | ------------------------------------------------------ |
| Auth          | 11        | ✅ Done         | Dual-token JWT, OTP, rotation, preferences, pw change  |
| Mood          | 15        | ✅ Done         | Analytics, burnout risk, heatmap, forecast, sentiment  |
| Habits        | 15        | ✅ Done         | Streak engine, milestone detection, DnD reorder        |
| AI            | 3         | ✅ Done         | Insights (cached), suggestions (cached), coach chat    |
| Analytics     | 2         | ✅ Done         | Mood ↔ habit lift, co-completion matrix                |
| Notifications | 4         | ✅ Done         | Bell polling + drawer + mark read                      |
| Billing       | 5         | ✅ Done         | Razorpay order + verify + cancel                       |
| Badges        | 1         | ✅ Done         | 6 badges, earned + locked shelf                        |
| Challenges    | 7         | ✅ Done         | Public/private, habit-linked, leaderboard, invite link |
| Community     | 3         | ✅ Done         | Anonymous feed, HMAC upvote deduplication              |
| Milestones    | 1         | 🔜 Optional     | GET /api/milestones — achievement timeline             |

---

_Last updated: March 2026 — All Phases 1–12 complete._
