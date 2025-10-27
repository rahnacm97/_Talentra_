// import {
//   ForgotPasswordDTO,
//   ResetPasswordDTO,
// } from "../../dto/auth/password.dto";

// export interface PasswordResponse {
//   message: string;
//   success: boolean;
// }

// export interface IPasswordService {
//   requestReset(data: ForgotPasswordDTO): Promise<PasswordResponse>;
//   resetPassword(data: ResetPasswordDTO): Promise<PasswordResponse>;
// }

import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  RequestResetResponseDTO,
  ResetPasswordResponseDTO,
} from "../../dto/auth/password.dto";

export interface IPasswordService {
  requestReset(data: ForgotPasswordDTO): Promise<RequestResetResponseDTO>;
  resetPassword(data: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
