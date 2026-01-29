import { Document, Types } from "mongoose";
export interface ISubscription extends Document {
    employerId: Types.ObjectId;
    plan: "free" | "professional" | "enterprise";
    startDate: Date;
    endDate: Date;
    status: "active" | "expired" | "past_due" | "cancelled";
    price: number;
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=ISubscription.d.ts.map