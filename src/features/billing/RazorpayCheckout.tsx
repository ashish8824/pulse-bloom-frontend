import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { updateUserPlan } from "@/features/auth/authSlice";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/services/billingApi";
import { useAppSelector } from "@/app/hooks";

// ── Razorpay SDK types ───────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: { color: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: () => void): void;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ── Component ────────────────────────────────────────────────────

interface RazorpayCheckoutProps {
  plan: "pro" | "enterprise";
  onSuccess: () => void;
  onError: (message: string) => void;
  onDismiss?: () => void;
  children: (props: {
    onClick: () => void;
    isLoading: boolean;
  }) => React.ReactNode;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckout({
  plan,
  onSuccess,
  onError,
  onDismiss,
  children,
}: RazorpayCheckoutProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Step 1: Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        onError(
          "Failed to load payment gateway. Please check your connection.",
        );
        setIsLoading(false);
        return;
      }

      // Step 2: Create order on backend
      const order = await createOrder({ plan }).unwrap();

      // Step 3: Open Razorpay popup
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "PulseBloom",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        order_id: order.orderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        theme: {
          color: "#a92fd4",
        },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Step 4: Verify payment on backend
            const result = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan,
            }).unwrap();

            if (result.success) {
              // Step 5: Update Redux plan instantly — all plan gates update
              dispatch(updateUserPlan(result.plan));
              onSuccess();
            } else {
              onError("Payment verification failed. Please contact support.");
            }
          } catch {
            onError("Payment verification failed. Please contact support.");
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onDismiss?.();
          },
        },
      });

      razorpay.open();
    } catch (err: any) {
      onError(
        err?.data?.message ?? "Failed to initiate payment. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return <>{children({ onClick: handleCheckout, isLoading })}</>;
}
