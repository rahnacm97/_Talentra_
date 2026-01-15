import { Schema, model } from "mongoose";
import { ISubscription } from "../interfaces/subscription/ISubscription";

const subscriptionSchema = new Schema<ISubscription>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "professional", "enterprise"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "past_due", "cancelled"],
      default: "active",
    },
    price: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    gstRate: {
      type: Number,
      required: true,
      default: 0.18,
    },
    gstAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
subscriptionSchema.index({ employerId: 1 });
subscriptionSchema.index({ employerId: 1, status: 1, endDate: 1 });

export default model<ISubscription>("Subscription", subscriptionSchema);
