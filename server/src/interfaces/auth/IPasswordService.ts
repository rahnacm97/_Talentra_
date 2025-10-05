import { ForgotPasswordDTO, ResetPasswordDTO } from "../../dto/auth/password.dto";

export interface IPasswordService{
    requestReset(data: ForgotPasswordDTO): Promise<any>;
    resetPassword(data: ResetPasswordDTO): Promise<any>;
}