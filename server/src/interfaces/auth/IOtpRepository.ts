import { IOtp } from "./IOtp";

export interface IOtpRepository{
    createOtp(email: string, otp: string, purpose: "signup" | "forgot-password", expiresAt: Date): Promise<IOtp>;
    findOtp(email: string, otp: string, purpose: string): Promise<IOtp | null>;
    deleteOtp(email: string, purpose: string): Promise<void>;
}