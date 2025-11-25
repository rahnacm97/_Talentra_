import { IOtpService } from "../../interfaces/auth/IOtpService";
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  RequestResetResponseDTO,
  ResetPasswordResponseDTO,
} from "../../dto/auth/password.dto";
import { detectUserByEmail } from "../../shared/utils/user.utils";
import bcrypt from "bcryptjs";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";
import { UserRepoMap } from "../../type/types";
import { IPasswordMapper } from "../../interfaces/auth/IPasswordMapper";

export class PasswordService implements IPasswordService {
  constructor(
    private _otpService: IOtpService,
    private _userRepos: UserRepoMap,
    private _passwordMapper: IPasswordMapper,
  ) {}

  async requestReset(
    data: ForgotPasswordDTO,
  ): Promise<RequestResetResponseDTO> {
    const detected = await detectUserByEmail(data.email, this._userRepos);
    if (!detected) throw new Error("User not found");

    await this._otpService.generateOtp(data.email, "forgot-password");
    return this._passwordMapper.toRequestResetResponseDTO();
  }

  async resetPassword(
    data: ResetPasswordDTO,
  ): Promise<ResetPasswordResponseDTO> {
    const detected = await detectUserByEmail(data.email, this._userRepos);
    if (!detected) throw new Error("User not found");

    const { user } = detected;

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return this._passwordMapper.toResetPasswordResponseDTO();
  }
}
