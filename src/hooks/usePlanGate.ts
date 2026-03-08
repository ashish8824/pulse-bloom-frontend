import { useAppSelector } from "@/app/hooks";
import type { Plan } from "@/types/auth.types";

type Resource =
  | "habit_create"
  | "mood_history"
  | "ai_insights"
  | "ai_suggestions"
  | "ai_chat"
  | "team_features";

const planRequirements: Record<Resource, Plan> = {
  habit_create: "pro",
  mood_history: "pro",
  ai_insights: "pro",
  ai_suggestions: "pro",
  ai_chat: "pro",
  team_features: "enterprise",
};

const planRank: Record<Plan, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export function usePlanGate(resource: Resource) {
  const plan = useAppSelector((state) => state.auth.user?.plan ?? "free");
  const required = planRequirements[resource];
  const canAccess = planRank[plan] >= planRank[required];

  return { canAccess, requiredPlan: required, currentPlan: plan };
}
