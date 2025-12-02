import { Document, Types } from "mongoose";

export type PlanType = "free" | "professional" | "enterprise";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "inactive"
  | "cancelled"
  | "past_due"
  | "incomplete";

export interface RazorpayData {
  subscriptionId?: string;
  customerId?: string;
  planId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export interface IEmployerSubscription extends Document {
  employerId: Types.ObjectId;

  plan: PlanType;
  status: SubscriptionStatus;

  razorpay: RazorpayData;

  trialEndsAt?: Date | null;
  activatedAt?: Date | null;
  cancelledAt?: Date | null;
  endedAt?: Date | null;

  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;

  get isActive(): boolean;
  get isTrialing(): boolean;
  get isPaid(): boolean;
}
