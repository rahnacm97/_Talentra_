import { OtpRepository } from "../../repositories/auth/otp.repository";
import { INotificationService } from "../../interfaces/auth/INotificationService";
import crypto from "crypto";
import { detectUserByEmail } from "../../shared/utils/user.utils";
import { IOtpService } from "../../interfaces/auth/IOtpService";
import { UserRepoMap } from "../../types/types";

export class OtpService implements IOtpService {
  constructor(
    private _otpRepository: OtpRepository,
    private _notificationService: INotificationService,
    private _userRepos: UserRepoMap,
  ) {}

  async generateOtp(email: string, purpose: "signup" | "forgot-password") {
    await this._otpRepository.deleteOtp(email, purpose);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 60 * 1000);

    await this._otpRepository.createOtp({
      email,
      otp,
      purpose,
      expiresAt,
      createdAt: new Date(),
    });

    await this._notificationService.sendOtp(email, otp);

    console.log("Otp", otp);

    return { message: "OTP sent successfully" };
  }

  async verifyOtp(email: string, purpose: string, otp: string) {
    const record = await this._otpRepository.findOtp(email, purpose);
    if (!record) throw new Error("OTP not found");
    if (record.expiresAt < new Date()) throw new Error("OTP expired");
    if (record.otp !== otp) throw new Error("Invalid OTP");

    await this._otpRepository.deleteOtp(email, purpose);

    if (purpose === "signup") {
      const detected = await detectUserByEmail(email, this._userRepos);
      console.log(
        "Verifying email for user:",
        detected?.user._id,
        detected?.userType,
      );
      if (detected) {
        const repo = this._userRepos[detected.userType];
        const updatedUser = await repo.verifyEmail?.(detected.user._id);

        if (updatedUser) {
          console.log(
            "Email verified successfully:",
            updatedUser.emailVerified,
          );
        } else {
          console.error("Failed to verify email");
        }
      }
    }

    return { success: true, message: "OTP verified successfully" };
  }
}
