import mongoose, { Document } from "mongoose";

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "inactive";

export interface IEmployerSubscription extends Document {
  _id: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  plan: "free" | "professional" | "enterprise";
  status: SubscriptionStatus;
  razorpay: {
    subscriptionId: string;
    customerId?: string;
    planId?: string;

    currentPeriodStart?: Date | undefined;
    currentPeriodEnd?: Date | undefined;
    cancelAtPeriodEnd?: boolean;
  };

  trialEndsAt?: Date;
  cancelledAt?: Date;
  activatedAt?: Date;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: Date;
  updatedAt: Date;
}
