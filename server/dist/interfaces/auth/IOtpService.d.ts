import { SendOtpDTO, VerifyOtpDTO } from "../../dto/auth/otp.dto";
export interface IOtpService {
    generateOtp(email: string, purpose: "signup" | "forgot-password"): Promise<SendOtpDTO>;
    verifyOtp(email: string, purpose: string, otp: string): Promise<VerifyOtpDTO>;
}
//# sourceMappingURL=IOtpService.d.ts.map