import { ForgotPasswordDTO, ResetPasswordDTO, RequestResetResponseDTO, ResetPasswordResponseDTO } from "../../dto/auth/password.dto";
export interface IPasswordService {
    requestReset(data: ForgotPasswordDTO): Promise<RequestResetResponseDTO>;
    resetPassword(data: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
//# sourceMappingURL=IPasswordService.d.ts.map