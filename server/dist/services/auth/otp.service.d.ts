import { INotificationService } from "../../interfaces/auth/INotificationService";
import { IOtpService } from "../../interfaces/auth/IOtpService";
import { IUserRepoMap } from "../../type/types";
import { SendOtpDTO, VerifyOtpDTO } from "../../dto/auth/otp.dto";
import { IOtpMapper } from "../../interfaces/auth/IOtpMapper";
import { IOtpRepository } from "../../interfaces/auth/IOtpRepository";
export declare class OtpService implements IOtpService {
    private _otpRepository;
    private _notificationService;
    private _userRepos;
    private _otpMapper;
    constructor(_otpRepository: IOtpRepository, _notificationService: INotificationService, _userRepos: IUserRepoMap, _otpMapper: IOtpMapper);
    generateOtp(email: string, purpose: "signup" | "forgot-password"): Promise<SendOtpDTO>;
    verifyOtp(email: string, purpose: string, otp: string): Promise<VerifyOtpDTO>;
}
//# sourceMappingURL=otp.service.d.ts.map