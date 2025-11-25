import { Schema, model } from "mongoose";
import { IEmployerSubscription } from "../interfaces/subscription/IEmployerSubscription";

const EmployerSubscriptionSchema = new Schema<IEmployerSubscription>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "professional", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "past_due", "trialing", "incomplete"],
      default: "incomplete",
    },
    razorpay: {
      subscriptionId: { type: String, unique: true, sparse: true },
      customerId: String,
      planId: String,
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: { type: Boolean, default: false },
    },
    trialEndsAt: Date,
    cancelledAt: Date,
    activatedAt: Date,
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

EmployerSubscriptionSchema.index({ employerId: 1, status: 1 });
EmployerSubscriptionSchema.index({ "razorpay.subscriptionId": 1 });

export default model<IEmployerSubscription>(
  "EmployerSubscription",
  EmployerSubscriptionSchema,
);
