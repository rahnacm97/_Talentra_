import { IOtpService } from "../../interfaces/auth/IOtpService";
import { IUserReader, IUserWriter } from "../../interfaces/auth/IAuthRepository";
import { ForgotPasswordDTO, ResetPasswordDTO } from "../../dto/auth/password.dto";
import { detectUserByEmail } from "../../utils/user.utils";
import bcrypt from "bcryptjs"

export class PasswordService{
    constructor(
        private otpService: IOtpService,
        private userRepos: Record<"Candidate" | "Employer" | "Admin", IUserReader<any> & IUserWriter<any>>
    ){}
    

  async requestReset(data: ForgotPasswordDTO) {
  const detected = await detectUserByEmail(data.email, this.userRepos);
  if (!detected) throw new Error("User not found");

  return this.otpService.generateOtp(data.email, "forgot-password");
}

async resetPassword(data: ResetPasswordDTO) {

  // await this.otpService.verifyOtp(data.email, "forgot-password", );

  const detected = await detectUserByEmail(data.email, this.userRepos);
  if (!detected) throw new Error("User not found");

  const { user, userType } = detected;

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { success: true, message: "Password reset successfully" };

}
}