import type { Plan } from "./auth.types";

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing"
  | "incomplete";

export interface Subscription {
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
}

export interface BillingStatus {
  currentPlan: Plan;
  subscription: Subscription | null;
  manageUrl: string;
}

export interface CreateOrderRequest {
  plan: "pro" | "enterprise";
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  plan: "pro" | "enterprise";
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  plan: "pro" | "enterprise";
}

export interface VerifyPaymentResponse {
  success: boolean;
  plan: Plan;
  message: string;
}

export interface PlanFeatures {
  habits: string;
  moodHistory: string;
  aiInsights: boolean;
  teamFeatures: boolean;
  price: string;
}

export const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  free: {
    habits: "3 max",
    moodHistory: "Last 30 days",
    aiInsights: false,
    teamFeatures: false,
    price: "₹0/mo",
  },
  pro: {
    habits: "Unlimited",
    moodHistory: "Full history",
    aiInsights: true,
    teamFeatures: false,
    price: "₹999/mo",
  },
  enterprise: {
    habits: "Unlimited",
    moodHistory: "Full history",
    aiInsights: true,
    teamFeatures: true,
    price: "₹2999/mo",
  },
};
