# 🌸 PulseBloom Frontend

> **React + TypeScript + Vite** — Behavioral analytics platform frontend with mood tracking, habit building, AI insights, and subscription billing.
>
> **Current Status: Phases 1–9 Complete. Next: Phase 10 — Habits Module.**

---

## 📦 Tech Stack

| Layer            | Technology                              | Notes                |
| ---------------- | --------------------------------------- | -------------------- |
| Framework        | React 18 + TypeScript + Vite 7          |                      |
| State Management | Redux Toolkit + RTK Query               |                      |
| Styling          | Tailwind CSS — dark theme, mobile-first |                      |
| Routing          | React Router v6                         |                      |
| Forms            | React Hook Form + Zod                   |                      |
| Charts           | Recharts + react-is (required peer dep) |                      |
| Drag & Drop      | @hello-pangea/dnd                       | For habit reordering |
| Dates            | date-fns                                |                      |
| Icons            | lucide-react                            |                      |
| Toasts           | react-hot-toast                         |                      |
| Class utils      | clsx + tailwind-merge                   |                      |

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
│   │   ├── moodApi.ts                  ✅ 13 mood endpoints
│   │   ├── habitApi.ts                 ✅ 15 habit endpoints
│   │   ├── aiApi.ts                    ✅ AI insights endpoint
│   │   └── billingApi.ts               ✅ Razorpay billing endpoints
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts            ✅ User, tokens, plan state
│   │   │   ├── RegisterPage.tsx        ✅ Zod validation, password show/hide
│   │   │   ├── VerifyEmailPage.tsx     ✅ 6-box OTP, paste, backspace nav, 60s resend
│   │   │   ├── LoginPage.tsx           ✅ Zod validation, password show/hide
│   │   │   ├── ForgotPasswordPage.tsx  ✅ Success state (prevents user enumeration)
│   │   │   ├── ResetPasswordPage.tsx   ✅ Token from URL, password match validation
│   │   │   └── ProtectedRoute.tsx      ✅ Auto session restore on hard refresh
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx       ✅ Overview — mood stats + habits + AI module cards
│   │   │
│   │   ├── mood/
│   │   │   ├── MoodDashboard.tsx       ✅ Tracker — stats, 13-week heatmap, quick links
│   │   │   ├── MoodLogForm.tsx         ✅ Score picker (1-5 emoji), journal, tag chips
│   │   │   ├── MoodHistory.tsx         ✅ Paginated list, inline edit/delete
│   │   │   ├── MoodTrendChart.tsx      ✅ Weekly avg + 7-day rolling average (Recharts)
│   │   │   ├── MoodInsights.tsx        ✅ Day-of-week bar chart + time-of-day grid
│   │   │   ├── BurnoutRiskCard.tsx     ✅ Donut score gauge + 4 metric cards
│   │   │   ├── MoodHeatmap.tsx         🔜 Standalone page (empty placeholder)
│   │   │   ├── MoodCalendar.tsx        🔜 Monthly calendar (empty placeholder)
│   │   │   └── MoodEntryModal.tsx      🔜 Standalone modal (empty placeholder)
│   │   │
│   │   ├── habits/
│   │   │   ├── HabitDashboard.tsx      🔜 Phase 10
│   │   │   ├── HabitList.tsx           🔜 Phase 10
│   │   │   ├── HabitCard.tsx           🔜 Phase 10
│   │   │   ├── HabitForm.tsx           🔜 Phase 10
│   │   │   ├── HabitDetailPage.tsx     🔜 Phase 10
│   │   │   ├── HabitHeatmap.tsx        🔜 Phase 10
│   │   │   ├── HabitCalendar.tsx       🔜 Phase 10
│   │   │   ├── HabitAnalyticsCard.tsx  🔜 Phase 10
│   │   │   ├── HabitLogHistory.tsx     🔜 Phase 10
│   │   │   ├── ArchivedHabits.tsx      🔜 Phase 10
│   │   │   └── MilestoneToast.tsx      🔜 Phase 10
│   │   │
│   │   ├── ai/
│   │   │   ├── AiInsightsPage.tsx      🔜 Phase 11
│   │   │   ├── InsightCard.tsx         🔜 Phase 11
│   │   │   └── AiPlanGate.tsx          🔜 Phase 11
│   │   │
│   │   ├── billing/
│   │   │   ├── BillingPage.tsx         🔜 Phase 11
│   │   │   ├── PricingPlans.tsx        🔜 Phase 11
│   │   │   ├── RazorpayCheckout.tsx    🔜 Phase 11
│   │   │   └── UpgradeBanner.tsx       🔜 Phase 11
│   │   │
│   │   └── profile/
│   │       └── ProfilePage.tsx         🔜 Phase 12
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx              ✅ 5 variants, 3 sizes, loading, fullWidth
│   │   │   ├── Input.tsx               ✅ Label, error, hint, focus ring
│   │   │   ├── Textarea.tsx            ✅ Same as Input, multiline, resize-none
│   │   │   ├── Badge.tsx               ✅ 6 color variants, 2 sizes
│   │   │   ├── Modal.tsx               ✅ Backdrop, ESC close, scroll lock, 4 sizes
│   │   │   ├── Spinner.tsx             ✅ 3 sizes, used inside Button loading state
│   │   │   ├── Skeleton.tsx            ✅ Pulse animation + CardSkeleton preset
│   │   │   ├── Tabs.tsx                ✅ Active highlight, icon support
│   │   │   ├── Tooltip.tsx             ✅ 4 positions, hover show/hide
│   │   │   └── EmptyState.tsx          ✅ Icon, title, description, optional CTA button
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx           ✅ Flex layout, manages sidebarOpen state
│   │   │   ├── Sidebar.tsx             ✅ Nav links, user info, plan badge, logout
│   │   │   ├── Topbar.tsx              ✅ Page title, hamburger (mobile only), plan badge
│   │   │   └── AuthLayout.tsx          ✅ Centered card, background glows, responsive
│   │   │
│   │   └── charts/
│   │       ├── HeatmapGrid.tsx         ✅ GitHub-style grid, mood + habit modes, h-scrollable
│   │       ├── LineChart.tsx           ✅ Multi-line, dark styled, ResponsiveContainer
│   │       ├── BarChart.tsx            ✅ Color function support, dark styled
│   │       └── DonutChart.tsx          ✅ Centre label, configurable color + size
│   │
│   ├── hooks/
│   │   ├── usePlanGate.ts              ✅ Returns { canAccess, requiredPlan, currentPlan }
│   │   ├── useDebounce.ts              ✅ Generic, configurable delay
│   │   ├── useLocalStorage.ts          ✅ Type-safe get/set wrapper
│   │   └── useTokenRefresh.ts          🔜 Future (silent background refresh)
│   │
│   ├── utils/
│   │   ├── formatDate.ts               ✅ formatDate, formatDateTime, formatRelative, toMonthParam
│   │   ├── moodColor.ts                ✅ moodToBg, moodToText, moodToLabel, moodEmojis
│   │   ├── planLimits.ts               ✅ FREE_HABIT_LIMIT=3, FREE_MOOD_HISTORY_DAYS=30
│   │   └── errorParser.ts              ✅ RTK Query error → readable string
│   │
│   ├── types/
│   │   ├── auth.types.ts               ✅ User, AuthState, Plan, LoginRequest, TokenResponse
│   │   ├── mood.types.ts               ✅ MoodEntry, Analytics, Heatmap, Burnout, Trends, Insights
│   │   ├── habit.types.ts              ✅ Habit, HabitLog, Analytics, Heatmap, Streak, Calendar
│   │   ├── ai.types.ts                 ✅ AiInsight, InsightType, InsightSeverity, AiInsightsResponse
│   │   └── billing.types.ts            ✅ Plan, Subscription, BillingStatus, Order, Verify, PLAN_FEATURES
│   │
│   ├── router/
│   │   └── index.tsx                   ✅ All public + protected routes wired
│   │
│   ├── App.tsx                         ✅ RouterProvider + dark-styled Toaster
│   ├── main.tsx                        ✅ Redux Provider wraps entire app
│   ├── index.css                       ✅ Tailwind directives + .card + .glass utilities
│   └── vite-env.d.ts                   ✅ ImportMetaEnv type declarations
│
├── .env                                VITE_API_BASE_URL, VITE_RAZORPAY_KEY_ID
├── .env.example
├── tailwind.config.js                  ✅ Brand purple palette + Inter font family
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

# Install recharts peer dependency (required!)
npm install react-is

# Start dev server
npm run dev
# → http://localhost:3000

# If you see recharts 504 "Outdated Optimize Dep" error:
Remove-Item -Recurse -Force node_modules/.vite
npm run dev -- --force

# Production build
npm run build

# Preview production build
npm run preview
```

### `.env` file (root of project)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

> ⚠️ NEVER put `RAZORPAY_KEY_SECRET` in frontend `.env` — backend only.

---

## 🏗️ Architecture

```
Page Component
  → RTK Query hook (useGetXxxQuery / useXxxMutation)
    → API Slice (injectEndpoints on baseApi)
      → baseQueryWithReauth
        → rawBaseQuery (attaches Bearer token from Redux)
          → Backend API

On 401 response:
  baseQueryWithReauth → POST /auth/refresh-token (via rawBaseQuery directly)
    ↓ success → dispatch(updateAccessToken()) → retry original request
    ↓ failure → dispatch(logout()) → redirect to /login
```

### Key Architecture Decisions

- **Feature-sliced** — each feature folder is self-contained, no cross-feature imports except shared components
- **RTK Query** — zero manual fetch/axios anywhere. All API state is cached and auto-invalidated
- **Access token in Redux only** — never localStorage. Survives component renders, lost on hard refresh
- **Refresh token in localStorage** — ProtectedRoute restores session on hard refresh via raw fetch
- **All components mobile-first** — Tailwind breakpoints `sm:`, `md:`, `lg:` used consistently

---

## 🔐 Authentication — Complete

### Token Strategy

| Token          | Where stored      | Lifetime | Reason                          |
| -------------- | ----------------- | -------- | ------------------------------- |
| `accessToken`  | Redux memory only | 15 min   | Never in DOM/storage → XSS safe |
| `refreshToken` | `localStorage`    | 7 days   | Must survive page refresh       |

### Complete Auth Flow

```
1. Register:
   POST /auth/register → navigate to /verify-email?email=user@example.com

2. OTP Verify:
   POST /auth/verify-email { email, otp }
   → dispatch(setCredentials({ user, accessToken, refreshToken }))
   → localStorage.setItem('refreshToken', ...)
   → navigate to /app/dashboard

3. Login:
   POST /auth/login { email, password }
   → dispatch(setCredentials(...))
   → navigate to /app/dashboard

4. Hard Page Refresh (ProtectedRoute):
   isAuthenticated = false (Redux reset)
   refreshToken = from localStorage
   → raw fetch POST /auth/refresh-token
   → success: dispatch(setCredentials(...)) → stay on page
   → failure: dispatch(logout()) → navigate to /login

5. Any API call with expired access token:
   baseQueryWithReauth detects 401
   → rawBaseQuery POST /auth/refresh-token
   → success: dispatch(updateAccessToken()) → retry original request
   → second 401: dispatch(logout())

6. Logout:
   POST /auth/logout { refreshToken }
   → dispatch(logout())
   → localStorage.removeItem('refreshToken')
   → navigate to /login
```

### Auth Pages

| Page                 | Route              | Features                                                                                      |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| `RegisterPage`       | `/register`        | name + email + password, Zod rules, password show/hide Eye toggle                             |
| `VerifyEmailPage`    | `/verify-email`    | 6 individual input boxes, paste support, auto-focus next, backspace prev, 60s resend cooldown |
| `LoginPage`          | `/login`           | email + password, password show/hide, auto-redirect if already logged in                      |
| `ForgotPasswordPage` | `/forgot-password` | Email input, always shows success state (prevents user enumeration)                           |
| `ResetPasswordPage`  | `/reset-password`  | Reads `?token=` from URL, password + confirm, match validation                                |

---

## 🔌 RTK Query API Layer

### baseApi.ts — The Interceptor

```typescript
// rawBaseQuery: attaches Authorization header from Redux state
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// baseQueryWithReauth: wraps rawBaseQuery, handles 401
// Uses rawBaseQuery directly for refresh (not the interceptor) to avoid infinite loop
const baseQueryWithReauth: BaseQueryFn<...> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken
    if (refreshToken) {
      const refreshResult = await rawBaseQuery({ url: '/auth/refresh-token', method: 'POST', body: { refreshToken } }, api, extraOptions)
      if (refreshResult.data) {
        api.dispatch(updateAccessToken(refreshResult.data as TokenResponse))
        result = await rawBaseQuery(args, api, extraOptions) // retry
      } else {
        api.dispatch(logout())
      }
    } else {
      api.dispatch(logout())
    }
  }
  return result
}
```

### All API Hooks Available

**Auth** (`authApi.ts`)

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
```

**Mood** (`moodApi.ts`)

```ts
(useCreateMoodMutation,
  useGetMoodsQuery,
  useGetMoodByIdQuery,
  useUpdateMoodMutation,
  useDeleteMoodMutation,
  useGetMoodAnalyticsQuery,
  useGetMoodStreakQuery,
  useGetMoodHeatmapQuery,
  useGetMoodMonthlySummaryQuery,
  useGetMoodDailyInsightsQuery,
  useGetWeeklyTrendsQuery,
  useGetRollingAverageQuery,
  useGetBurnoutRiskQuery);
```

**Habits** (`habitApi.ts`)

```ts
(useCreateHabitMutation,
  useGetHabitsQuery,
  useGetArchivedHabitsQuery,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useRestoreHabitMutation,
  useReorderHabitsMutation,
  useCompleteHabitMutation,
  useUndoCompletionMutation,
  useUpdateReminderMutation,
  useGetHabitStreakQuery,
  useGetHabitAnalyticsQuery,
  useGetHabitMonthlySummaryQuery,
  useGetHabitHeatmapQuery,
  useGetHabitLogsQuery);
```

**AI** (`aiApi.ts`)

```ts
useGetAiInsightsQuery; // supports { refresh: true } to bypass SHA-256 cache
```

**Billing** (`billingApi.ts`)

```ts
(useGetBillingStatusQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCancelSubscriptionMutation);
```

### Cache Tag Invalidation

| Tag              | Invalidated by                                                     |
| ---------------- | ------------------------------------------------------------------ |
| `MoodEntry`      | createMood, updateMood, deleteMood                                 |
| `MoodAnalytics`  | createMood, updateMood, deleteMood                                 |
| `MoodStreak`     | createMood, deleteMood                                             |
| `MoodHeatmap`    | createMood, updateMood, deleteMood                                 |
| `BurnoutRisk`    | createMood, deleteMood                                             |
| `Habit`          | createHabit, updateHabit, deleteHabit, reorderHabits, restoreHabit |
| `HabitLog`       | completeHabit, undoCompletion                                      |
| `HabitStreak`    | completeHabit, undoCompletion                                      |
| `HabitAnalytics` | completeHabit, undoCompletion                                      |
| `HabitHeatmap`   | completeHabit, undoCompletion                                      |
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
| `/app/habits`          | HabitDashboard     | ✅   | 🔜 Phase 10 |
| `/app/habits/archived` | ArchivedHabits     | ✅   | 🔜 Phase 10 |
| `/app/habits/:id`      | HabitDetailPage    | ✅   | 🔜 Phase 10 |
| `/app/ai`              | AiInsightsPage     | ✅   | 🔜 Phase 11 |
| `/app/billing`         | BillingPage        | ✅   | 🔜 Phase 11 |
| `/app/profile`         | ProfilePage        | ✅   | 🔜 Phase 12 |
| `*`                    | → `/login`         | ❌   | ✅          |

---

## 🎨 Design System

### Brand Colors (`tailwind.config.js`)

```js
brand: {
  50:  '#fdf4ff',
  100: '#fae8ff',
  400: '#d974fa',   // text accents, active states
  500: '#c44ef0',   // focus rings, hover
  600: '#a92fd4',   // buttons, active nav background
  700: '#8b23ad',
  800: '#731f8d',
  900: '#601d73',
}
```

### Base Theme (`index.css`)

```css
body → bg-gray-950 text-gray-100 antialiased

.card  → bg-gray-900 border border-gray-800 rounded-2xl
.glass → bg-white/5 backdrop-blur-sm border border-white/10
```

### Responsive Layout

| Breakpoint    | Sidebar                          | Grid columns | Padding |
| ------------- | -------------------------------- | ------------ | ------- |
| Mobile `< lg` | Hidden drawer (hamburger toggle) | 2-col        | `p-4`   |
| Desktop `lg+` | Always visible, `w-64`           | 3-4 col      | `p-6`   |

### Sidebar Mobile Behavior

- `AppLayout` manages `sidebarOpen` state
- Hamburger button in `Topbar` → `setSidebarOpen(true)`
- Backdrop overlay click → `setSidebarOpen(false)`
- X button in `Sidebar` → `onClose()`
- Any `<NavLink>` click → `onClose()` (auto-close on navigate)

### Component Quick Reference

```
Button     → variant: primary|secondary|ghost|destructive|outline
           → size: sm|md|lg, loading: bool, fullWidth: bool

Badge      → variant: default|success|warning|danger|info|purple
           → size: sm|md

Modal      → size: sm|md|lg|xl, isOpen, onClose, title?

Skeleton   → className, lines? (for multi-line)
CardSkeleton → pre-built card loading state

EmptyState → icon?, title, description?, action?: { label, onClick }

Tabs       → tabs: {id, label, icon?}[], activeTab, onChange

Tooltip    → content, position: top|bottom|left|right
```

---

## 📊 Mood Module — Phase 9 Complete

### What's Built

| Component         | Route                | Key Features                                                                |
| ----------------- | -------------------- | --------------------------------------------------------------------------- |
| `DashboardPage`   | `/app/dashboard`     | Greeting with time, all-module stat cards, clickable module tiles           |
| `MoodDashboard`   | `/app/mood`          | 4 stat cards, 13-week heatmap, quick nav to trends/insights/burnout         |
| `MoodLogForm`     | In Modal             | Emoji score selector 1-5, 5000-char journal, tag chip input with add/remove |
| `MoodHistory`     | `/app/mood/history`  | Paginated 10/page, edit (opens modal), delete with confirm, tags display    |
| `MoodTrendChart`  | `/app/mood/trends`   | Merged weekly avg + 7-day rolling avg on same Recharts LineChart            |
| `MoodInsights`    | `/app/mood/insights` | Day-of-week BarChart with color function, time-of-day 2×4 grid              |
| `BurnoutRiskCard` | `/app/mood/burnout`  | DonutChart score, Low/Moderate/High badge, 4 metric cards                   |

### Mood Score Visual System

```
Score 1 → bg-red-900/60    text-red-400    😞  "Very Low"
Score 2 → bg-orange-900/60 text-orange-400 😕  "Low"
Score 3 → bg-yellow-900/60 text-yellow-400 😐  "Okay"
Score 4 → bg-emerald-900/60 text-emerald-400 😊 "Good"
Score 5 → bg-emerald-600/80 text-emerald-300 😄 "Excellent"
Score 0 → bg-gray-800 (no data)
```

### Chart Components

| Component     | Props                                                      | Used in                             |
| ------------- | ---------------------------------------------------------- | ----------------------------------- |
| `HeatmapGrid` | `days: {date, value, count?}[]`, `mode: mood\|habit`       | MoodDashboard, HabitDetailPage      |
| `LineChart`   | `data`, `lines: {key, color, label}[]`, `xKey`, `yDomain?` | MoodTrendChart                      |
| `BarChart`    | `data`, `xKey`, `barKey`, `color?`, `colorFn?`, `yDomain?` | MoodInsights                        |
| `DonutChart`  | `value: 0-100`, `color?`, `size?`, `label?`, `sublabel?`   | BurnoutRiskCard, HabitAnalyticsCard |

---

## 🔒 Plan-Aware UI

### `usePlanGate(resource)` — `src/hooks/usePlanGate.ts`

```ts
type Resource =
  | "habit_create"
  | "mood_history"
  | "ai_insights"
  | "team_features";

const { canAccess, requiredPlan, currentPlan } = usePlanGate("ai_insights");
// canAccess: boolean
// requiredPlan: 'pro' | 'enterprise'
// currentPlan: 'free' | 'pro' | 'enterprise'
```

### Plan Limits Table

| Resource        | Free    | Pro          | Enterprise   |
| --------------- | ------- | ------------ | ------------ |
| `habit_create`  | Max 3   | Unlimited    | Unlimited    |
| `mood_history`  | 30 days | Full history | Full history |
| `ai_insights`   | ❌      | ✅           | ✅           |
| `team_features` | ❌      | ❌           | ✅           |

### authSlice — Plan Updates

```ts
// After successful billing verification:
dispatch(updateUserPlan("pro"));
// → All usePlanGate() hooks re-evaluate instantly
// → Plan badges in Sidebar + Topbar update instantly
// → UpgradeBanner components disappear instantly
```

---

## 🧘 Phase 10 — Habits Module (BUILD THIS NEXT)

### Components to Build

#### `HabitDashboard.tsx` → `/app/habits`

- Today's habits list with complete/undo buttons
- Stats row: active count, completed today, overall streak
- "Create Habit" button — if Free user has 3 habits, show UpgradeBanner instead
- Link to archived habits page
- Uses: `useGetHabitsQuery`, `useCompleteHabitMutation`, `useUndoCompletionMutation`

#### `HabitList.tsx`

- Wraps habits in `DragDropContext` + `Droppable` from `@hello-pangea/dnd`
- Each `HabitCard` is a `Draggable`
- `onDragEnd` → calculate new sortOrders → `useReorderHabitsMutation`
- **Optimistic update**: update local order instantly, rollback on API error

#### `HabitCard.tsx`

- Shows: icon/emoji + title + category badge + frequency badge + current streak
- Complete button → green check → `useCompleteHabitMutation({ id, body: {} })`
- If completed today: show Undo button → `useUndoCompletionMutation(id)`
- After complete: check response for `milestone` → trigger `MilestoneToast`
- Click card → navigate to `/app/habits/:id`
- Edit/Delete buttons (shown on hover desktop, always shown mobile)

#### `HabitForm.tsx` (Modal — create + edit)

- Fields: title (required), description, frequency (daily/weekly radio), category (select), color (color picker or preset swatches), icon (emoji picker or text input), targetPerWeek (if weekly), reminderOn toggle, reminderTime (time input, shown if reminderOn)
- Zod schema validation
- Create: `useCreateHabitMutation`
- Edit: `useUpdateHabitMutation({ id, body })`

#### `HabitDetailPage.tsx` → `/app/habits/:id`

- Header: habit icon + title + category + edit/archive buttons
- `HabitAnalyticsCard` — full analytics
- `HabitHeatmap` — 365-day GitHub grid
- `HabitCalendar` — current month calendar
- `HabitLogHistory` — paginated completion log
- Uses: `useGetHabitAnalyticsQuery(id)`, `useGetHabitHeatmapQuery({ id, days: 365 })`

#### `HabitAnalyticsCard.tsx`

- `DonutChart` showing consistency score (0-100%)
- Stats: completion rate, current streak, longest streak, missed periods, best day of week
- Uses: `useGetHabitAnalyticsQuery(id)`

#### `HabitHeatmap.tsx`

- Uses `HeatmapGrid` with `mode='habit'`
- Green = completed, gray = missed
- Uses: `useGetHabitHeatmapQuery({ id, days: 365 })`

#### `HabitCalendar.tsx`

- Monthly grid — 7 columns (days of week)
- Green dot = completed, gray = missed, empty = future
- Month navigation (prev/next)
- Uses: `useGetHabitMonthlySummaryQuery({ id, month: 'YYYY-MM' })`

#### `HabitLogHistory.tsx`

- Paginated list of completions (date + note if any)
- Uses: `useGetHabitLogsQuery({ id, page, limit: 10 })`

#### `ArchivedHabits.tsx` → `/app/habits/archived`

- List of `isArchived: true` habits
- Restore button → `useRestoreHabitMutation(id)`
- Delete permanently button → `useDeleteHabitMutation(id)`
- Uses: `useGetArchivedHabitsQuery()`

#### `MilestoneToast.tsx`

- Triggered from `HabitCard` when `completeHabit` response has `milestone !== null`
- Milestone days: 7, 14, 21, 30, 60, 90, 100, 180, 365
- Show `react-hot-toast` with celebration emoji + milestone message
- Example: "🎉 21-day streak! You're on fire!"

### Habit Types Quick Reference

```ts
interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly";
  category:
    | "health"
    | "fitness"
    | "learning"
    | "mindfulness"
    | "productivity"
    | "custom";
  color?: string;
  icon?: string;
  targetPerWeek?: number;
  sortOrder: number;
  isArchived: boolean;
  reminderTime?: string;
  reminderOn: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CompleteHabitResponse {
  message: string;
  log: HabitLog;
  currentStreak: number;
  milestone: { days: number; message: string } | null;
}

interface HabitAnalytics {
  totalCompletions: number;
  totalPossiblePeriods: number;
  completionRate: number; // 0-100
  currentStreak: number;
  longestStreak: number;
  missedPeriods: number;
  bestDayOfWeek: string;
  consistencyScore: number; // 0-100, used in DonutChart
}
```

### Responsive Requirements for Phase 10

- **HabitDashboard**: stat row = 2-col mobile → 4-col desktop
- **HabitList**: full width, drag handle visible on all screen sizes
- **HabitCard**: compact on mobile, expanded on desktop hover
- **HabitDetailPage**: stacked on mobile, 2-column on desktop (analytics left, calendar right)
- **HabitForm Modal**: full-screen on mobile (`size='lg'`)

---

## 🤖 Phase 11 — AI Insights + Billing

### AI Insights

- `AiInsightsPage` — Pro/Enterprise only
  - Shows 3-6 `InsightCard` components
  - Refresh button with `?refresh=true` to bypass server SHA-256 cache
  - Shows `cached: true` indicator (zero Groq cost for cached responses)
  - Loading skeleton while fetching
- `InsightCard` — type badge + severity chip + title + description
  - Types: `correlation | streak | warning | positive | suggestion`
  - Severity: `info (blue) | warning (amber) | success (green)`
- `AiPlanGate` — shown to Free users
  - Blurred preview of fake insight cards behind overlay
  - "Upgrade to Pro" CTA button → navigate to `/app/billing`

### Billing — Razorpay Flow

```
1. User clicks "Upgrade to Pro"
2. POST /billing/order { plan: 'pro' } → { orderId, amount, currency, keyId }
3. Dynamically load Razorpay checkout script
4. Open Razorpay popup with order details
5. User completes payment (card/UPI/netbanking)
6. Razorpay calls handler({ razorpayPaymentId, razorpayOrderId, razorpaySignature })
7. POST /billing/verify { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan }
8. Response: { success: true, plan: 'pro' }
9. dispatch(updateUserPlan('pro'))
10. → All plan gates update instantly across entire app
```

---

## 🔒 Security Notes

- Access tokens **never in localStorage** — Redux in-memory only (XSS safe)
- Refresh tokens in localStorage — cleared on logout + reuse detection 401
- All API calls via `baseQueryWithReauth` — no scattered raw fetch with tokens
- `RAZORPAY_KEY_SECRET` never in frontend — backend only
- `VITE_` env vars bundled into client — never put secrets here
- Password show/hide toggle uses `type='text'/'password'` switching — no custom logic

---

## 📋 Build Progress

### ✅ Completed Phases

| Phase | Built                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Vite + React + TS scaffold, Tailwind dark theme, brand colors, folder structure, @ path alias                                            |
| 2     | TypeScript types — all API request/response shapes for all 5 modules                                                                     |
| 3     | Redux store + authSlice (user, accessToken in memory, refreshToken in localStorage, plan) + typed hooks                                  |
| 4     | RTK Query baseApi with 401 interceptor + all 5 API slices (auth, mood, habit, ai, billing)                                               |
| 5     | 10 shared UI components — Button, Input, Textarea, Badge, Modal, Spinner, Skeleton, Tabs, Tooltip, EmptyState                            |
| 6     | Layout components — AuthLayout, Sidebar, Topbar, AppLayout                                                                               |
| 6b    | Full responsive layout — mobile sidebar drawer, hamburger, backdrop, auto-close on nav                                                   |
| 7     | Router (all routes), ProtectedRoute (auto session restore on hard refresh), utility hooks, utils                                         |
| 8     | All 5 auth pages with Zod validation + password show/hide Eye toggle                                                                     |
| 9     | Mood module — DashboardPage, MoodDashboard, MoodLogForm, MoodHistory, MoodTrendChart, MoodInsights, BurnoutRiskCard + 4 chart components |

### 🔜 Remaining Phases

| Phase  | To Build                                                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **10** | **Habits — HabitDashboard, HabitList (DnD), HabitCard, HabitForm, HabitDetailPage, HabitAnalyticsCard, HabitHeatmap, HabitCalendar, HabitLogHistory, ArchivedHabits, MilestoneToast** |
| 11     | AI Insights (InsightCard, AiPlanGate) + Billing (PricingPlans, RazorpayCheckout, UpgradeBanner)                                                                                       |
| 12     | ProfilePage + Error boundaries + 404 page + final polish                                                                                                                              |

---

## 🔗 Backend Reference

Swagger UI: `http://localhost:5000/api-docs`

| Module      | Endpoints | Notes                                                              |
| ----------- | --------- | ------------------------------------------------------------------ |
| Auth        | 9         | Dual-token JWT, OTP email, reuse detection kills all sessions      |
| Mood        | 13        | Analytics, burnout risk (0-100 score), heatmap, rolling average    |
| Habits      | 15        | Streak engine, milestone detection, drag-and-drop reorder endpoint |
| AI Insights | 1         | Groq LLM, SHA-256 content hash caching, `refresh` param            |
| Billing     | 5         | Razorpay order create + webhook verify + cancel subscription       |

---

_Last updated: March 2026 — Phases 1–9 complete. Phase 10 (Habits Module) is next._
