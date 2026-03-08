import { Check, X, Sparkles, Users, Zap } from "lucide-react";
import { clsx } from "clsx";
import { PLAN_FEATURES } from "@/types/billing.types";
import type { Plan } from "@/types/auth.types";

interface PricingPlansProps {
  currentPlan: Plan;
  onSelectPlan: (plan: "pro" | "enterprise") => void;
  isLoading?: boolean;
}

interface FeatureRowProps {
  label: string;
  value: string | boolean;
}

function FeatureRow({ label, value }: FeatureRowProps) {
  const isBoolean = typeof value === "boolean";

  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-800/60 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      {isBoolean ? (
        value ? (
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <X className="w-4 h-4 text-gray-600 shrink-0" />
        )
      ) : (
        <span className="text-sm font-medium text-white">{value}</span>
      )}
    </div>
  );
}

const planMeta: Record<
  Plan,
  {
    icon: React.ElementType;
    label: string;
    color: string;
    highlight: boolean;
    badge?: string;
  }
> = {
  free: {
    icon: Zap,
    label: "Free",
    color: "text-gray-400",
    highlight: false,
  },
  pro: {
    icon: Sparkles,
    label: "Pro",
    color: "text-brand-400",
    highlight: true,
    badge: "Most Popular",
  },
  enterprise: {
    icon: Users,
    label: "Enterprise",
    color: "text-amber-400",
    highlight: false,
  },
};

export function PricingPlans({
  currentPlan,
  onSelectPlan,
  isLoading = false,
}: PricingPlansProps) {
  const plans: Plan[] = ["free", "pro", "enterprise"];
  const planRank: Record<Plan, number> = { free: 0, pro: 1, enterprise: 2 };
  const currentRank = planRank[currentPlan];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => {
        const features = PLAN_FEATURES[plan];
        const meta = planMeta[plan];
        const Icon = meta.icon;
        const isCurrent = plan === currentPlan;
        const isDowngrade = planRank[plan] < currentRank;
        const isUpgrade = planRank[plan] > currentRank;

        return (
          <div
            key={plan}
            className={clsx(
              "relative flex flex-col rounded-2xl border p-6 transition-all",
              meta.highlight
                ? "bg-brand-600/10 border-brand-500/40 shadow-lg shadow-brand-500/5"
                : "bg-gray-900 border-gray-800",
              isCurrent && "ring-2 ring-brand-500/50",
            )}
          >
            {/* Popular badge */}
            {meta.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white">
                  {meta.badge}
                </span>
              </div>
            )}

            {/* Current plan badge */}
            {isCurrent && (
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-600/20 border border-brand-500/30 text-brand-400">
                  Current
                </span>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  meta.highlight
                    ? "bg-brand-600/25 border border-brand-500/30"
                    : "bg-gray-800 border border-gray-700",
                )}
              >
                <Icon className={clsx("w-4 h-4", meta.color)} />
              </div>
              <h3 className="text-base font-bold text-white">{meta.label}</h3>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">
                {features.price.split("/")[0]}
              </span>
              {features.priceValue > 0 && (
                <span className="text-sm text-gray-500">/month</span>
              )}
            </div>

            {/* Features */}
            <div className="flex-1 mb-6">
              <FeatureRow label="Habits" value={features.habits} />
              <FeatureRow label="Mood History" value={features.moodHistory} />
              <FeatureRow label="AI Insights" value={features.aiInsights} />
              <FeatureRow label="AI Coach Chat" value={features.aiChat} />
              <FeatureRow label="Team Features" value={features.teamFeatures} />
            </div>

            {/* CTA */}
            {isCurrent ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
              >
                Current Plan
              </button>
            ) : isDowngrade ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-800"
              >
                Downgrade
              </button>
            ) : isUpgrade && plan !== "free" ? (
              <button
                onClick={() => onSelectPlan(plan as "pro" | "enterprise")}
                disabled={isLoading}
                className={clsx(
                  "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                  meta.highlight
                    ? "bg-brand-600 hover:bg-brand-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
                )}
              >
                {isLoading ? "Processing..." : `Upgrade to ${meta.label}`}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
