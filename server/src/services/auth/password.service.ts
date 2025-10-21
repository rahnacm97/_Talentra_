import { IOtpService } from "../../interfaces/auth/IOtpService";
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from "../../dto/auth/password.dto";
import { detectUserByEmail } from "../../shared/utils/user.utils";
import bcrypt from "bcryptjs";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";
import { UserRepoMap } from "../../types/types";

export class PasswordService implements IPasswordService {
  constructor(
    private _otpService: IOtpService,
    private _userRepos: UserRepoMap,
  ) {}

  async requestReset(data: ForgotPasswordDTO) {
    const detected = await detectUserByEmail(data.email, this._userRepos);
    if (!detected) throw new Error("User not found");

    await this._otpService.generateOtp(data.email, "forgot-password");
    return { success: true, message: "OTP sent successfully" };
  }

  async resetPassword(data: ResetPasswordDTO) {
    const detected = await detectUserByEmail(data.email, this._userRepos);
    if (!detected) throw new Error("User not found");

    const { user } = detected;

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password reset successfully" };
  }
}
