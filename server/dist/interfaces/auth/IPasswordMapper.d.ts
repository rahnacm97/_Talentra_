import { RequestResetResponseDTO, ResetPasswordResponseDTO } from "../../dto/auth/password.dto";
export interface IPasswordMapper {
    toRequestResetResponseDTO(): RequestResetResponseDTO;
    toResetPasswordResponseDTO(): ResetPasswordResponseDTO;
}
//# sourceMappingURL=IPasswordMapper.d.ts.map