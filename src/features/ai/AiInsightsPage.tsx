import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Brain, MessageSquare, Sparkles, Info } from "lucide-react";
import { clsx } from "clsx";
import { useGetAiInsightsQuery } from "@/services/aiApi";
import { InsightCard } from "./InsightCard";
import { SuggestionsPanel } from "./SuggestionsPanel";
import { AiPlanGate } from "./AiPlanGate";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function InsightsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}

function InsightsSection() {
  const [forceRefresh, setForceRefresh] = useState(false);
  const { data, isLoading, isFetching, refetch } = useGetAiInsightsQuery(
    forceRefresh ? { refresh: true } : {},
  );

  const handleRefresh = () => {
    setForceRefresh(true);
    refetch();
  };

  const insights = data?.insights ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-brand-400" />
          <h2 className="text-base font-semibold text-white">
            Behavioral Insights
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

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-300/70 leading-relaxed">
          Insights are generated from your last 90 days of mood and habit data.
          Results are cached until your data changes significantly.
        </p>
      </div>

      {/* Insights grid */}
      {isLoading ? (
        <InsightsSkeleton />
      ) : insights.length === 0 ? (
        <EmptyState
          icon={<Brain className="w-8 h-8 text-gray-600" />}
          title="No insights yet"
          description={
            data?.message ??
            "Log at least 7 mood entries or complete a habit 5+ times to unlock AI insights."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
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

export function AiInsightsPage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            AI Insights
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Personalized behavioral analysis powered by your data
          </p>
        </div>

        {/* Chat CTA */}
        <Link
          to="/app/ai/chat"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          Talk to AI Coach
        </Link>
      </div>

      {/* Gated content */}
      <AiPlanGate feature="ai_insights">
        <div className="flex flex-col gap-8">
          {/* Insights section */}
          <InsightsSection />

          {/* Divider */}
          <div className="border-t border-gray-800" />

          {/* Suggestions section */}
          <SuggestionsPanel />
        </div>
      </AiPlanGate>
    </div>
  );
}
