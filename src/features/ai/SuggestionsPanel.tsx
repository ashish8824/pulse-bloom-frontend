import { useState } from "react";
import {
  RefreshCw,
  Sparkles,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { clsx } from "clsx";
import { useGetAiSuggestionsQuery } from "@/services/aiApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AiSuggestion } from "@/types/ai.types";

const categoryColors: Record<string, string> = {
  fitness: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  mindfulness: "text-brand-400 bg-brand-400/10 border-brand-400/20",
  sleep: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  nutrition: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  social: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  learning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  productivity: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

function SuggestionCard({
  suggestion,
  index,
}: {
  suggestion: AiSuggestion;
  index: number;
}) {
  const catColor =
    categoryColors[suggestion.category?.toLowerCase()] ??
    categoryColors.productivity;

  return (
    <div className="card p-5 flex flex-col gap-4 hover:bg-gray-800/60 transition-colors">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 shrink-0 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
          {index + 1}
        </span>
        <h4 className="text-sm font-semibold text-white leading-snug">
          {suggestion.title}
        </h4>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {suggestion.category && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
              catColor,
            )}
          >
            <Target className="w-3 h-3" />
            {suggestion.category}
          </span>
        )}
        {suggestion.frequency && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border text-gray-400 bg-gray-700/40 border-gray-600/40 capitalize">
            <Calendar className="w-3 h-3" />
            {suggestion.frequency}
          </span>
        )}
      </div>

      {suggestion.rationale && (
        <p className="text-sm text-gray-400 leading-relaxed">
          {suggestion.rationale}
        </p>
      )}

      {suggestion.expectedMoodImpact && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-300/80 leading-relaxed">
            {suggestion.expectedMoodImpact}
          </p>
        </div>
      )}
    </div>
  );
}

export function SuggestionsPanel() {
  const [forceRefresh, setForceRefresh] = useState(false);
  const { data, isLoading, isFetching, refetch } = useGetAiSuggestionsQuery(
    forceRefresh ? { refresh: true } : {},
  );

  const handleRefresh = () => {
    setForceRefresh(true);
    refetch();
  };

  const suggestions = data?.suggestions ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h2 className="text-base font-semibold text-white">
            Habit Suggestions
          </h2>
          {data?.cached && (
            <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full">
              cached
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={clsx("w-3.5 h-3.5", isFetching && "animate-spin")}
          />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8 text-gray-600" />}
          title="No suggestions yet"
          description={
            data?.message ??
            "Log more mood entries and habits to get personalized suggestions."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {suggestions.map((s, i) => (
            <SuggestionCard key={i} suggestion={s} index={i} />
          ))}
        </div>
      )}

      {data?.generatedAt && (
        <p className="text-xs text-gray-600 text-right">
          Generated {new Date(data.generatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
