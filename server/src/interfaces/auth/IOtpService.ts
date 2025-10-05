export interface IOtpService {
  generateOtp(email: string,purpose: "signup" | "forgot-password",): Promise<{ message: string }>;
  verifyOtp(email: string, purpose: string, otp: string ): Promise<{ success: boolean; message: string }>;
}
