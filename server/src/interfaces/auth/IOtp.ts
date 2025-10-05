export interface IOtp{
    email: string;
    otp: string;
    purpose: "signup" | "forgot-password";
    expiresAt: Date;
    createdAt: Date;
}