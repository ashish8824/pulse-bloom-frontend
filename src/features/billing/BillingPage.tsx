import { useState } from "react";
import {
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import {
  useGetBillingStatusQuery,
  useCancelSubscriptionMutation,
} from "@/services/billingApi";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { updateUserPlan } from "@/features/auth/authSlice";
import { PricingPlans } from "./PricingPlans";
import { RazorpayCheckout } from "./RazorpayCheckout";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Plan } from "@/types/auth.types";
import type { SubscriptionStatus } from "@/types/billing.types";

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; color: string; Icon: React.ElementType }
> = {
  active: {
    label: "Active",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
    Icon: XCircle,
  },
  past_due: {
    label: "Past Due",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Icon: AlertTriangle,
  },
  trialing: {
    label: "Trialing",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Icon: Clock,
  },
  incomplete: {
    label: "Incomplete",
    color: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    Icon: AlertTriangle,
  },
};

function CurrentPlanCard() {
  const dispatch = useAppDispatch();
  const currentPlan = useAppSelector(
    (state) => state.auth.user?.plan ?? "free",
  );
  const { data, isLoading } = useGetBillingStatusQuery();
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      dispatch(updateUserPlan("free"));
      toast.success(
        "Subscription cancelled. You'll retain access until the period ends.",
      );
      setShowCancelModal(false);
    } catch {
      toast.error("Failed to cancel subscription. Please try again.");
    }
  };

  if (isLoading) return <Skeleton className="h-32 rounded-2xl" />;

  const subscription = data?.subscription;
  const status = subscription?.status;
  const statusInfo = status ? statusConfig[status] : null;

  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white capitalize">
                {currentPlan} Plan
              </h3>
              {statusInfo && (
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                    statusInfo.color,
                  )}
                >
                  <statusInfo.Icon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
              )}
            </div>
            {renewalDate && status !== "cancelled" && (
              <p className="text-sm text-gray-400 mt-0.5">
                Renews on {renewalDate}
              </p>
            )}
            {subscription?.cancelledAt && renewalDate && (
              <p className="text-sm text-amber-400/80 mt-0.5">
                Cancelled — access until {renewalDate}
              </p>
            )}
            {currentPlan === "free" && (
              <p className="text-sm text-gray-400 mt-0.5">
                Upgrade to unlock AI insights and unlimited habits
              </p>
            )}
          </div>
        </div>
        {currentPlan !== "free" && status === "active" && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-sm text-gray-500 hover:text-red-400 transition-colors shrink-0"
          >
            Cancel subscription
          </button>
        )}
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Are you sure?</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                You'll lose access to AI insights, unlimited habits, and all Pro
                features at the end of your current billing period.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowCancelModal(false)}
              fullWidth
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              loading={isCancelling}
              fullWidth
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function BillingPage() {
  const currentPlan = useAppSelector(
    (state) => state.auth.user?.plan ?? "free",
  ) as Plan;
  const [checkoutPlan, setCheckoutPlan] = useState<"pro" | "enterprise" | null>(
    null,
  );

  const handleSuccess = () => {
    setCheckoutPlan(null);
    toast.success("🎉 Welcome to Pro! All features are now unlocked.", {
      duration: 5000,
    });
  };

  const handleError = (message: string) => {
    setCheckoutPlan(null);
    toast.error(message);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-400" />
          Billing & Plans
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your subscription and upgrade your plan
        </p>
      </div>

      <CurrentPlanCard />

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-800" />
        <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
          Available Plans
        </span>
        <div className="flex-1 border-t border-gray-800" />
      </div>

      {checkoutPlan ? (
        <RazorpayCheckout
          plan={checkoutPlan}
          onSuccess={handleSuccess}
          onError={handleError}
          onDismiss={() => setCheckoutPlan(null)}
        >
          {({ onClick, isLoading }) => (
            <PricingPlans
              currentPlan={currentPlan}
              onSelectPlan={(plan) => {
                setCheckoutPlan(plan);
                onClick();
              }}
              isLoading={isLoading}
            />
          )}
        </RazorpayCheckout>
      ) : (
        <PricingPlans
          currentPlan={currentPlan}
          onSelectPlan={setCheckoutPlan}
        />
      )}

      <p className="text-xs text-gray-600 text-center">
        🔒 Payments secured by Razorpay · Cancel anytime · No hidden fees
      </p>
    </div>
  );
}
