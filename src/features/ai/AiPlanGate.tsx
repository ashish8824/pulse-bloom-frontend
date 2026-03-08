import { Link } from "react-router-dom";
import { Lock, Sparkles, Zap } from "lucide-react";
import { usePlanGate } from "@/hooks/usePlanGate";

interface AiPlanGateProps {
  children: React.ReactNode;
  feature?: "ai_insights" | "ai_suggestions" | "ai_chat";
}

export function AiPlanGate({
  children,
  feature = "ai_insights",
}: AiPlanGateProps) {
  const { canAccess, requiredPlan } = usePlanGate(feature);

  if (canAccess) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred fake content behind */}
      <div
        className="pointer-events-none select-none blur-sm opacity-40"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-gray-900/95 border border-brand-600/40 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl shadow-brand-600/10">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-brand-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              {requiredPlan} Feature
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            Unlock AI Insights
          </h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Upgrade to get personalized behavioral insights, habit suggestions,
            and your AI wellness coach — all powered by 90 days of your data.
          </p>

          <Link
            to="/app/billing"
            className="inline-flex items-center gap-2 w-full justify-center px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
          >
            <Zap className="w-4 h-4" />
            Upgrade to {requiredPlan}
          </Link>

          <p className="mt-3 text-xs text-gray-500">
            Cancel anytime · Instant activation
          </p>
        </div>
      </div>
    </div>
  );
}
