import { useNavigate } from "react-router-dom";
import { Smile, Target, Sparkles, Flame, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { MoodLogForm } from "@/features/mood/MoodLogForm";
import {
  useGetMoodStreakQuery,
  useGetMoodAnalyticsQuery,
  useGetBurnoutRiskQuery,
} from "@/services/moodApi";
import { useGetHabitsQuery } from "@/services/habitApi";
import { useAppSelector } from "@/app/hooks";
import { moodToText, moodToLabel, moodEmojis } from "@/utils/moodColor";

export function DashboardPage() {
  const navigate = useNavigate();
  const [logOpen, setLogOpen] = useState(false);
  const user = useAppSelector((s) => s.auth.user);

  const { data: streak, isLoading: l1 } = useGetMoodStreakQuery();
  const { data: analytics, isLoading: l2 } = useGetMoodAnalyticsQuery();
  const { data: burnout, isLoading: l3 } = useGetBurnoutRiskQuery();
  const { data: habits, isLoading: l4 } = useGetHabitsQuery();

  const burnoutVariant = {
    Low: "success",
    Moderate: "warning",
    High: "danger",
  } as const;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const activeHabits = habits?.filter((h) => !h.isArchived) ?? [];
  const avgMood = analytics?.averageMood ?? 0;

  return (
    <div className="space-y-5 md:space-y-6">
      {/* ── Greeting ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-100">
            {greeting()}, {user?.name?.split(" ")[0]} 🌸
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button size="sm" onClick={() => setLogOpen(true)}>
          <Plus size={15} /> Log Today's Mood
        </Button>
      </div>

      {/* ── Top stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Mood score */}
        <div
          className="card p-4 md:p-5 space-y-1 cursor-pointer hover:border-gray-700 transition-colors"
          onClick={() => navigate("/app/mood")}
        >
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Smile size={12} /> Today's Mood
          </p>
          {l2 ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <>
              <p className={`text-2xl font-bold ${moodToText(avgMood)}`}>
                {avgMood
                  ? `${avgMood.toFixed(1)} ${moodEmojis[Math.round(avgMood)]}`
                  : "—"}
              </p>
              <p className="text-xs text-gray-600">
                {avgMood ? moodToLabel(Math.round(avgMood)) : "Not logged yet"}
              </p>
            </>
          )}
        </div>

        {/* Streak */}
        <div
          className="card p-4 md:p-5 space-y-1 cursor-pointer hover:border-gray-700 transition-colors"
          onClick={() => navigate("/app/mood")}
        >
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Flame size={12} /> Mood Streak
          </p>
          {l1 ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <>
              <p className="text-2xl font-bold text-brand-400">
                {streak?.currentStreak ?? 0}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  days
                </span>
              </p>
              <p className="text-xs text-gray-600">
                Best: {streak?.longestStreak ?? 0}d
              </p>
            </>
          )}
        </div>

        {/* Active habits */}
        <div
          className="card p-4 md:p-5 space-y-1 cursor-pointer hover:border-gray-700 transition-colors"
          onClick={() => navigate("/app/habits")}
        >
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Target size={12} /> Active Habits
          </p>
          {l4 ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-100">
                {activeHabits.length}
              </p>
              <p className="text-xs text-gray-600">
                {user?.plan === "free"
                  ? `${activeHabits.length}/3 free`
                  : "Unlimited"}
              </p>
            </>
          )}
        </div>

        {/* Burnout */}
        <div
          className="card p-4 md:p-5 space-y-1 cursor-pointer hover:border-gray-700 transition-colors"
          onClick={() => navigate("/app/mood/burnout")}
        >
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <TrendingUp size={12} /> Burnout Risk
          </p>
          {l3 ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-100">
                {burnout?.riskScore ?? 0}
                <span className="text-sm font-normal text-gray-500">/100</span>
              </p>
              {burnout?.riskLevel && (
                <Badge variant={burnoutVariant[burnout.riskLevel]} size="sm">
                  {burnout.riskLevel}
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Module cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mood */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 flex items-center justify-center">
                <Smile size={16} className="text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-200">Mood</h3>
            </div>
            <button
              onClick={() => navigate("/app/mood")}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Current streak</span>
              <span className="text-brand-400 font-medium">
                {streak?.currentStreak ?? 0} days
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avg this month</span>
              <span className={`font-medium ${moodToText(avgMood)}`}>
                {avgMood ? avgMood.toFixed(1) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total entries</span>
              <span className="text-gray-300">
                {analytics?.totalEntries ?? 0}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            fullWidth
            onClick={() => navigate("/app/mood/history")}
          >
            View History
          </Button>
        </div>

        {/* Habits */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Target size={16} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-200">Habits</h3>
            </div>
            <button
              onClick={() => navigate("/app/habits")}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>
          {l4 ? (
            <Skeleton lines={3} />
          ) : activeHabits.length === 0 ? (
            <p className="text-sm text-gray-500">
              No habits yet. Create your first one!
            </p>
          ) : (
            <div className="space-y-2">
              {activeHabits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="flex items-center gap-2">
                  <span className="text-base">{habit.icon ?? "🎯"}</span>
                  <span className="text-sm text-gray-400 truncate flex-1">
                    {habit.title}
                  </span>
                  <Badge variant="default" size="sm">
                    {habit.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            fullWidth
            onClick={() => navigate("/app/habits")}
          >
            Manage Habits
          </Button>
        </div>

        {/* AI Insights */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <Sparkles size={16} className="text-brand-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-200">
                AI Insights
              </h3>
            </div>
            {user?.plan === "free" && (
              <Badge variant="purple" size="sm">
                Pro
              </Badge>
            )}
          </div>

          {user?.plan === "free" ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Upgrade to Pro to unlock AI-powered behavioral insights powered
                by Groq.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Mood ↔ habit correlations</li>
                <li>• Streak pattern analysis</li>
                <li>• Personalized suggestions</li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Your personalized AI insights are ready.
            </p>
          )}

          <Button
            size="sm"
            variant={user?.plan === "free" ? "primary" : "outline"}
            fullWidth
            onClick={() =>
              navigate(user?.plan === "free" ? "/app/billing" : "/app/ai")
            }
          >
            {user?.plan === "free" ? "Upgrade to Pro" : "View Insights"}
          </Button>
        </div>
      </div>

      {/* Log mood modal */}
      <Modal
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
        title="Log Mood"
        size="md"
      >
        <MoodLogForm onSuccess={() => setLogOpen(false)} />
      </Modal>
    </div>
  );
}
