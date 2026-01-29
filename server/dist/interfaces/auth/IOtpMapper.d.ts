import { SendOtpDTO, VerifyOtpDTO } from "../../dto/auth/otp.dto";
export interface IOtpMapper {
    toSendOtpDTO(): SendOtpDTO;
    toVerifyOtpDTO(): VerifyOtpDTO;
}
//# sourceMappingURL=IOtpMapper.d.ts.map