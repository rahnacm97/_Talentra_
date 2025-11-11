import { IPasswordMapper } from "../../interfaces/auth/IPasswordMapper";
import {
  RequestResetResponseDTO,
  ResetPasswordResponseDTO,
} from "../../dto/auth/password.dto";

export class PasswordMapper implements IPasswordMapper {
  toRequestResetResponseDTO(): RequestResetResponseDTO {
    return {
      success: true,
      message: "OTP sent successfully",
    };
  }

  toResetPasswordResponseDTO(): ResetPasswordResponseDTO {
    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}
