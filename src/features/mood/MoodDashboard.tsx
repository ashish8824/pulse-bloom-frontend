import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flame, TrendingUp, AlertTriangle, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MoodLogForm } from "./MoodLogForm";
import { HeatmapGrid } from "@/components/charts/HeatmapGrid";
import { moodToLabel, moodToText } from "@/utils/moodColor";
import {
  useGetMoodAnalyticsQuery,
  useGetMoodStreakQuery,
  useGetBurnoutRiskQuery,
  useGetMoodHeatmapQuery,
} from "@/services/moodApi";

export function MoodDashboard() {
  const navigate = useNavigate();
  const [logOpen, setLogOpen] = useState(false);

  const { data: analytics, isLoading: loadingAnalytics } =
    useGetMoodAnalyticsQuery();
  const { data: streak, isLoading: loadingStreak } = useGetMoodStreakQuery();
  const { data: burnout, isLoading: loadingBurnout } = useGetBurnoutRiskQuery();
  const { data: heatmap, isLoading: loadingHeatmap } = useGetMoodHeatmapQuery({
    days: 91,
  });

  // ── Backend returns "Insufficient Data" as a riskLevel — handle it ──
  const burnoutVariant = (level: string | undefined) => {
    if (level === "Low") return "success" as const;
    if (level === "Moderate") return "warning" as const;
    if (level === "High") return "danger" as const;
    if (level === "Insufficient Data") return "default" as const;
    return "default" as const;
  };

  const heatmapDays =
    heatmap?.heatmap.map((d) => ({
      date: d.date,
      value: d.averageScore,
      count: d.count,
    })) ?? [];

  const quickLinks = [
    { label: "View Trends", path: "/app/mood/trends", emoji: "📈" },
    { label: "Daily Insights", path: "/app/mood/insights", emoji: "🧠" },
    { label: "Burnout Report", path: "/app/mood/burnout", emoji: "⚠️" },
    { label: "Forecast", path: "/app/mood/forecast", emoji: "🔮" },
    { label: "Sentiment", path: "/app/mood/sentiment", emoji: "💬" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-100">
            Mood Tracker
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            How are you feeling today?
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/app/mood/history")}
          >
            <History size={15} />
            <span className="hidden sm:inline">History</span>
          </Button>
          <Button size="sm" onClick={() => setLogOpen(true)}>
            <Plus size={15} /> Log Mood
          </Button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Avg Mood */}
        <div className="card p-4 md:p-5 space-y-1">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <TrendingUp size={12} /> Avg Mood
          </p>
          {loadingAnalytics ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <>
              <p
                className={`text-2xl font-bold ${moodToText(analytics?.averageMood ?? 0)}`}
              >
                {analytics?.averageMood?.toFixed(1) ?? "—"}
              </p>
              <p className="text-xs text-gray-600">
                {moodToLabel(Math.round(analytics?.averageMood ?? 0))}
              </p>
            </>
          )}
        </div>

        {/* Streak */}
        <div className="card p-4 md:p-5 space-y-1">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Flame size={12} /> Streak
          </p>
          {loadingStreak ? (
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
                Best: {streak?.longestStreak ?? 0} days
              </p>
            </>
          )}
        </div>

        {/* Total Entries */}
        <div className="card p-4 md:p-5 space-y-1">
          <p className="text-xs text-gray-500">Total Entries</p>
          {loadingAnalytics ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-100">
                {analytics?.totalEntries ?? 0}
              </p>
              <p className="text-xs text-gray-600">All time</p>
            </>
          )}
        </div>

        {/* Burnout Risk */}
        <div className="card p-4 md:p-5 space-y-1">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <AlertTriangle size={12} /> Burnout Risk
          </p>
          {loadingBurnout ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-100">
                {burnout?.riskScore ?? 0}
                <span className="text-sm font-normal text-gray-500">/100</span>
              </p>
              {burnout?.riskLevel && (
                <Badge variant={burnoutVariant(burnout.riskLevel)} size="sm">
                  {burnout.riskLevel}
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="card p-4 md:p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Last 13 Weeks
        </h3>
        {loadingHeatmap ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <HeatmapGrid days={heatmapDays} mode="mood" />
        )}
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-600">Less</span>
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <div
              key={v}
              className={`w-3 h-3 rounded-sm ${
                v === 0
                  ? "bg-gray-800"
                  : v === 1
                    ? "bg-red-900/60"
                    : v === 2
                      ? "bg-orange-900/60"
                      : v === 3
                        ? "bg-yellow-900/60"
                        : v === 4
                          ? "bg-emerald-900/60"
                          : "bg-emerald-600/80"
              }`}
            />
          ))}
          <span className="text-xs text-gray-600">More</span>
        </div>
      </div>

      {/* ── Quick links — 2 col mobile, 3 col sm, 5 col lg ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickLinks.map(({ label, path, emoji }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="card p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 hover:border-gray-700 transition-colors text-center sm:text-left"
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs sm:text-sm font-medium text-gray-300">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Log Mood Modal ── */}
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
