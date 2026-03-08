import { TrendingUp, TrendingDown, Info, BarChart2 } from "lucide-react";
import { clsx } from "clsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useGetCorrelationQuery } from "@/services/analyticsApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CorrelationResult } from "@/types/analytics.types";

// ── Lift badge ────────────────────────────────────────────────────

function LiftBadge({ lift }: { lift: number }) {
  const positive = lift >= 0;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border",
        positive
          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
          : "text-red-400 bg-red-400/10 border-red-400/20",
      )}
    >
      {positive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {positive ? "+" : ""}
      {lift.toFixed(2)}
    </span>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-white mb-2 max-w-[160px] truncate">
        {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-medium">{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Stat row ──────────────────────────────────────────────────────

function StatRow({ result }: { result: CorrelationResult }) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">
            {result.habitTitle}
          </p>
          <p className="text-xs text-gray-500 capitalize mt-0.5">
            {result.frequency}
          </p>
        </div>
        <LiftBadge lift={result.lift} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Done days avg</p>
          <p className="text-base font-bold text-emerald-400">
            {result.completionDayAvg.toFixed(1)}
          </p>
          <p className="text-xs text-gray-600">
            {result.completionDaysAnalyzed} days
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/15 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Skipped days avg</p>
          <p className="text-base font-bold text-red-400">
            {result.skipDayAvg.toFixed(1)}
          </p>
          <p className="text-xs text-gray-600">
            {result.skipDaysAnalyzed} days
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────

export function CorrelationPage() {
  const { data, isLoading } = useGetCorrelationQuery();
  const correlations = data?.correlations ?? [];

  // Prepare chart data — truncate long titles
  const chartData = correlations.map((c) => ({
    name:
      c.habitTitle.length > 14 ? c.habitTitle.slice(0, 14) + "…" : c.habitTitle,
    "Done days": parseFloat(c.completionDayAvg.toFixed(2)),
    "Skipped days": parseFloat(c.skipDayAvg.toFixed(2)),
    lift: c.lift,
  }));

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-400" />
          Mood ↔ Habit Correlation
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          How each habit affects your average mood score
        </p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-300/70 leading-relaxed">
          <strong className="text-blue-300">Lift</strong> = avg mood on
          completion days minus avg mood on skip days. Positive lift means
          completing this habit correlates with better mood. Analyzed over the
          last {data?.analyzedDays ?? 90} days ({data?.moodLoggedDays ?? 0}{" "}
          mood-logged days).
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : correlations.length === 0 ? (
        <EmptyState
          icon={<BarChart2 className="w-8 h-8 text-gray-600" />}
          title="No correlation data yet"
          description={
            data?.message ??
            "Complete your habits consistently for at least a week alongside mood logging to see correlations."
          }
        />
      ) : (
        <>
          {/* Bar chart */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-white mb-4">
              Avg Mood Score — Completion vs Skip Days
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#9ca3af",
                    paddingTop: 12,
                  }}
                />
                <Bar dataKey="Done days" fill="#34d399" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#34d399" />
                  ))}
                </Bar>
                <Bar
                  dataKey="Skipped days"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#f87171" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detail cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {correlations.map((c) => (
              <StatRow key={c.habitId} result={c} />
            ))}
          </div>

          {data?.message && (
            <p className="text-xs text-gray-600 text-center">{data.message}</p>
          )}
        </>
      )}
    </div>
  );
}
