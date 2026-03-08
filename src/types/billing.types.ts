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
  aiChat: boolean;
  teamFeatures: boolean;
  price: string;
  priceValue: number; // in paise for Razorpay
}

export const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  free: {
    habits: "Up to 3 habits",
    moodHistory: "Last 30 days only",
    aiInsights: false,
    aiChat: false,
    teamFeatures: false,
    price: "₹0/mo",
    priceValue: 0,
  },
  pro: {
    habits: "Unlimited habits",
    moodHistory: "Full history",
    aiInsights: true,
    aiChat: true,
    teamFeatures: false,
    price: "₹299/mo",
    priceValue: 29900,
  },
  enterprise: {
    habits: "Unlimited habits",
    moodHistory: "Full history",
    aiInsights: true,
    aiChat: true,
    teamFeatures: true,
    price: "₹799/mo",
    priceValue: 79900,
  },
};
