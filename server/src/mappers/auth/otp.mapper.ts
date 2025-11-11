import { IOtpMapper } from "../../interfaces/auth/IOtpMapper";
import { SendOtpDTO, VerifyOtpDTO } from "../../dto/auth/otp.dto";

export class OtpMapper implements IOtpMapper {
  toSendOtpDTO(): SendOtpDTO {
    return {
      message: "OTP sent successfully",
    };
  }

  toVerifyOtpDTO(): VerifyOtpDTO {
    return {
      success: true,
      message: "OTP verified successfully",
    };
  }
}
