import { baseApi } from "./baseApi";
import type {
  BillingStatus,
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/types/billing.types";

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingStatus: builder.query<BillingStatus, void>({
      query: () => "/billing/status",
      providesTags: ["BillingStatus"],
    }),

    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: "/billing/order",
        method: "POST",
        body,
      }),
    }),

    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
      VerifyPaymentRequest
    >({
      query: (body) => ({
        url: "/billing/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BillingStatus"],
    }),

    cancelSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/billing/subscription",
        method: "DELETE",
      }),
      invalidatesTags: ["BillingStatus"],
    }),
  }),
});

export const {
  useGetBillingStatusQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCancelSubscriptionMutation,
} = billingApi;
