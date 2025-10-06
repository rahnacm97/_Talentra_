import { OtpRepository } from "../../repositories/auth/otp.repository";
import { INotificationService } from "../../interfaces/auth/INotificationService";
import {
  IUserReader,
  IUserWriter,
} from "../../interfaces/auth/IAuthRepository";
import crypto from "crypto";
import { detectUserByEmail } from "../../utils/user.utils";
import { IOtpService } from "../../interfaces/auth/IOtpService";

export class OtpService implements IOtpService{
  constructor(
    private otpRepository: OtpRepository,
    private notificationService: INotificationService,
    private userRepos: Record<
      "Candidate" | "Employer" | "Admin",
      IUserReader<any> & IUserWriter<any>
    >,
  ) {}

  async generateOtp(email: string, purpose: "signup" | "forgot-password") {
    await this.otpRepository.deleteOtp(email, purpose);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 60 * 1000);

    await this.otpRepository.createOtp({
      email,
      otp,
      purpose,
      expiresAt,
      createdAt: new Date(),
    });

    await this.notificationService.sendOtp(email, otp);

    console.log("Otp", otp);

    return { message: "OTP sent successfully" };
  }

  async verifyOtp(email: string, purpose: string, otp: string) {
    const record = await this.otpRepository.findOtp(email, purpose);
    if (!record) throw new Error("OTP not found");
    if (record.expiresAt < new Date()) throw new Error("OTP expired");
    if (record.otp !== otp) throw new Error("Invalid OTP");

    await this.otpRepository.deleteOtp(email, purpose);

    if (purpose === "signup") {
      const detected = await detectUserByEmail(email, this.userRepos);
      if (detected) {
        const repo = this.userRepos[detected.userType];
        await repo.verifyEmail?.(detected.user._id);
      }
    }

    return { success: true, message: "OTP verified successfully" };
  }
}
