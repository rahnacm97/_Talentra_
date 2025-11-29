export type PlanType = "monthly" | "yearly";

export interface CreateSubscriptionRequestDTO {
  planType: PlanType;
}

export interface CreateSubscriptionResponseDTO {
  subscription: string;
  key: string;
}

export interface CurrentSubscriptionResponseDTO {
  currentPlan: "free" | "professional" | "enterprise";
  planType: PlanType | null;
  isActive: boolean;
  status:
    | "active"
    | "cancelled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "inactive"
    | "created";
  nextBillingDate: string | null | undefined;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null | undefined;
  billingHistory?: Array<{
    date: string;
    description: string;
    amount: number;
    status: string;
    invoiceUrl?: string;
  }>;
}

export interface CancelSubscriptionResponseDTO {
  message: string;
  cancelled: boolean;
}

export interface RazorpayDetailsDTO {
  subscriptionId: string | null;
  customerId: string | null;
  planId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionResponseDTO {
  id: string;
  employerId: string;
  plan: "free" | "professional" | "enterprise";
  status:
    | "active"
    | "cancelled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "inactive";
  razorpay: RazorpayDetailsDTO;
  trialEndsAt: Date | null;
  cancelledAt: Date | null;
  activatedAt: Date | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
