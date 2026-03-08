import { clsx } from "clsx";
import {
  TrendingUp,
  Flame,
  AlertTriangle,
  ThumbsUp,
  Lightbulb,
} from "lucide-react";
import type { AiInsight, InsightType, InsightSeverity } from "@/types/ai.types";

interface InsightCardProps {
  insight: AiInsight;
}

const typeConfig: Record<
  InsightType,
  { label: string; Icon: React.ElementType; color: string }
> = {
  correlation: {
    label: "Correlation",
    Icon: TrendingUp,
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  streak: {
    label: "Streak",
    Icon: Flame,
    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  warning: {
    label: "Warning",
    Icon: AlertTriangle,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  positive: {
    label: "Positive",
    Icon: ThumbsUp,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  suggestion: {
    label: "Suggestion",
    Icon: Lightbulb,
    color: "text-brand-400 bg-brand-400/10 border-brand-400/20",
  },
};

const severityBorder: Record<InsightSeverity, string> = {
  info: "border-l-blue-500",
  warning: "border-l-amber-500",
  success: "border-l-emerald-500",
};

const severityDot: Record<InsightSeverity, string> = {
  info: "bg-blue-400",
  warning: "bg-amber-400",
  success: "bg-emerald-400",
};

const severityLabel: Record<InsightSeverity, string> = {
  info: "Info",
  warning: "Heads Up",
  success: "Great News",
};

const severityChipColor: Record<InsightSeverity, string> = {
  info: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  warning: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export function InsightCard({ insight }: InsightCardProps) {
  const { type, title, description, severity } = insight;
  const typeInfo = typeConfig[type] ?? typeConfig.suggestion;
  const { Icon } = typeInfo;

  return (
    <div
      className={clsx(
        "card border-l-4 p-5 flex flex-col gap-3 hover:bg-gray-800/60 transition-colors",
        severityBorder[severity],
      )}
    >
      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            typeInfo.color,
          )}
        >
          <Icon className="w-3 h-3" />
          {typeInfo.label}
        </span>
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
            severityChipColor[severity],
          )}
        >
          <span
            className={clsx("w-1.5 h-1.5 rounded-full", severityDot[severity])}
          />
          {severityLabel[severity]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
