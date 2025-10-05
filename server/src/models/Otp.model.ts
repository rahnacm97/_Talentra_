import { Schema, model } from "mongoose";
import { IOtp } from "../interfaces/auth/IOtp";

const otpSchema = new Schema<IOtp>({
    email: { type: String, required: true},
    otp: { type: String, required: true},
    purpose: { type: String, enum: ["signup", "forgot-password"], required: true},
    expiresAt: { type: Date, required: true},
    createdAt: { type: Date, default: Date.now},
})

export default model<IOtp>("Otp", otpSchema);