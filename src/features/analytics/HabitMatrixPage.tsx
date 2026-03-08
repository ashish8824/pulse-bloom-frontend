import { Grid2x2, Info, Layers } from "lucide-react";
import { clsx } from "clsx";
import { useGetHabitMatrixQuery } from "@/services/analyticsApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { HabitPairResult } from "@/types/analytics.types";

// ── Color scale for co-completion rate ───────────────────────────

function getRateColor(rate: number): string {
  if (rate >= 80) return "bg-emerald-500/80 text-white";
  if (rate >= 60) return "bg-emerald-500/40 text-emerald-300";
  if (rate >= 40) return "bg-yellow-500/30 text-yellow-300";
  return "bg-gray-700/40 text-gray-500";
}

function getRateBorderColor(rate: number): string {
  if (rate >= 80) return "border-emerald-500/40";
  if (rate >= 60) return "border-emerald-500/20";
  if (rate >= 40) return "border-yellow-500/20";
  return "border-gray-700/40";
}

function getRateLabel(rate: number): string {
  if (rate >= 80) return "Strong stack";
  if (rate >= 60) return "Often paired";
  if (rate >= 40) return "Occasional";
  return "Rarely together";
}

// ── Pair card ─────────────────────────────────────────────────────

function PairCard({ pair }: { pair: HabitPairResult }) {
  const rate = pair.coCompletionRate;

  return (
    <div
      className={clsx(
        "card p-4 flex flex-col gap-3 border",
        getRateBorderColor(rate),
      )}
    >
      {/* Habit names */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {pair.habitA.title}
          </p>
        </div>
        <Layers className="w-3.5 h-3.5 text-gray-600 shrink-0" />
        <div className="flex-1 min-w-0 text-right">
          <p className="text-xs font-semibold text-white truncate">
            {pair.habitB.title}
          </p>
        </div>
      </div>

      {/* Rate + label */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={clsx(
            "inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold",
            getRateColor(rate),
          )}
        >
          {rate.toFixed(1)}%
        </span>
        <span className="text-xs text-gray-500">{getRateLabel(rate)}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all",
            rate >= 80
              ? "bg-emerald-500"
              : rate >= 60
                ? "bg-emerald-400"
                : rate >= 40
                  ? "bg-yellow-400"
                  : "bg-gray-600",
          )}
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Both: {pair.coCompletedDays}d</span>
        <span>Either: {pair.eitherCompletedDays}d</span>
      </div>

      {/* Suggestion */}
      <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-800 pt-2">
        {pair.suggestion}
      </p>
    </div>
  );
}

// ── Matrix grid (visual heatmap) ──────────────────────────────────

function MatrixGrid({
  matrix,
  habits,
}: {
  matrix: HabitPairResult[];
  habits: { id: string; title: string }[];
}) {
  if (habits.length < 2) return null;

  // Build lookup: "habitAId-habitBId" → rate
  const lookup: Record<string, number> = {};
  matrix.forEach((p) => {
    lookup[`${p.habitA.id}-${p.habitB.id}`] = p.coCompletionRate;
    lookup[`${p.habitB.id}-${p.habitA.id}`] = p.coCompletionRate;
  });

  const shortTitle = (t: string) => (t.length > 10 ? t.slice(0, 10) + "…" : t);

  return (
    <div className="card p-5 overflow-x-auto">
      <p className="text-sm font-semibold text-white mb-4">
        Co-completion Matrix
      </p>
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-24 p-2" />
            {habits.map((h) => (
              <th
                key={h.id}
                className="p-2 text-gray-400 font-medium text-center max-w-[80px]"
              >
                <span className="block truncate w-16">
                  {shortTitle(h.title)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((rowHabit) => (
            <tr key={rowHabit.id}>
              <td className="p-2 text-gray-400 font-medium text-right pr-3 max-w-[96px]">
                <span className="truncate block w-20 text-right">
                  {shortTitle(rowHabit.title)}
                </span>
              </td>
              {habits.map((colHabit) => {
                const isSelf = rowHabit.id === colHabit.id;
                const rate = lookup[`${rowHabit.id}-${colHabit.id}`];

                return (
                  <td key={colHabit.id} className="p-1">
                    <div
                      className={clsx(
                        "w-14 h-10 rounded-lg flex items-center justify-center text-xs font-bold",
                        isSelf
                          ? "bg-gray-800 text-gray-600"
                          : rate !== undefined
                            ? getRateColor(rate)
                            : "bg-gray-800/40 text-gray-600",
                      )}
                    >
                      {isSelf
                        ? "—"
                        : rate !== undefined
                          ? `${rate.toFixed(0)}%`
                          : "—"}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        {[
          { label: "≥80% Strong", color: "bg-emerald-500/80" },
          { label: "≥60% Often", color: "bg-emerald-500/40" },
          { label: "≥40% Occasional", color: "bg-yellow-500/30" },
          { label: "<40% Rarely", color: "bg-gray-700/40" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={clsx("w-3 h-3 rounded", color)} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────

export function HabitMatrixPage() {
  const { data, isLoading } = useGetHabitMatrixQuery();
  const matrix = data?.matrix ?? [];

  // Derive unique habits list from matrix pairs
  const habitsMap = new Map<string, string>();
  matrix.forEach((p) => {
    habitsMap.set(p.habitA.id, p.habitA.title);
    habitsMap.set(p.habitB.id, p.habitB.title);
  });
  const habits = Array.from(habitsMap.entries()).map(([id, title]) => ({
    id,
    title,
  }));

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Grid2x2 className="w-5 h-5 text-brand-400" />
          Habit Co-completion Matrix
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          How often your habits are completed on the same day
        </p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-300/70 leading-relaxed">
          Co-completion rate = days both habits done ÷ days either habit was
          done. High rates suggest strong habit stacking opportunities. Analyzed
          over {data?.analyzedDays ?? 90} days across {data?.totalHabits ?? 0}{" "}
          habits.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-48 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : matrix.length === 0 ? (
        <EmptyState
          icon={<Grid2x2 className="w-8 h-8 text-gray-600" />}
          title="No matrix data yet"
          description={
            data?.message ??
            "You need at least 2 active habits with completion history to see the matrix."
          }
        />
      ) : (
        <>
          {/* Visual matrix grid */}
          <MatrixGrid matrix={matrix} habits={habits} />

          {/* Pair cards */}
          <div>
            <p className="text-sm font-semibold text-white mb-3">
              All Habit Pairs
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matrix.map((pair, i) => (
                <PairCard key={i} pair={pair} />
              ))}
            </div>
          </div>

          {data?.message && (
            <p className="text-xs text-gray-600 text-center">{data.message}</p>
          )}
        </>
      )}
    </div>
  );
}
