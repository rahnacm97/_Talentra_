import { IOtpService } from "../../interfaces/auth/IOtpService";
import { ForgotPasswordDTO, ResetPasswordDTO, RequestResetResponseDTO, ResetPasswordResponseDTO } from "../../dto/auth/password.dto";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";
import { IUserRepoMap } from "../../type/types";
import { IPasswordMapper } from "../../interfaces/auth/IPasswordMapper";
export declare class PasswordService implements IPasswordService {
    private _otpService;
    private _userRepos;
    private _passwordMapper;
    constructor(_otpService: IOtpService, _userRepos: IUserRepoMap, _passwordMapper: IPasswordMapper);
    requestReset(data: ForgotPasswordDTO): Promise<RequestResetResponseDTO>;
    resetPassword(data: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
//# sourceMappingURL=password.service.d.ts.map