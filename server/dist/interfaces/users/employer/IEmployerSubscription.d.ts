import mongoose, { Document } from "mongoose";
export interface IEmployerSubscription extends Document {
    employerId: mongoose.Types.ObjectId;
    plan: "free" | "professional" | "enterprise";
    status: "active" | "cancelled" | "past_due" | "trialing" | "incomplete";
    razorpay: {
        subscriptionId: string;
        customerId?: string;
        planId?: string;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
    };
    trialEndsAt?: Date;
    cancelledAt?: Date;
    activatedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=IEmployerSubscription.d.ts.map