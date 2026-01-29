"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_utils_1 = require("../../shared/utils/user.utils");
const constants_1 = require("../../shared/constants/constants");
class OtpService {
    constructor(_otpRepository, _notificationService, _userRepos, _otpMapper) {
        this._otpRepository = _otpRepository;
        this._notificationService = _notificationService;
        this._userRepos = _userRepos;
        this._otpMapper = _otpMapper;
    }
    //Otp generation
    async generateOtp(email, purpose) {
        await this._otpRepository.deleteOtp(email, purpose);
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + constants_1.OTP_TTL_MINUTES * 60 * 1000);
        await this._otpRepository.createOtp({
            email,
            otp,
            purpose,
            expiresAt,
            createdAt: new Date(),
        });
        await this._notificationService.sendOtp(email, otp);
        console.log("Otp", otp);
        return this._otpMapper.toSendOtpDTO();
    }
    //Otp verification
    async verifyOtp(email, purpose, otp) {
        const record = await this._otpRepository.findOtp(email, purpose);
        if (!record)
            throw new Error("OTP not found");
        if (record.expiresAt < new Date())
            throw new Error("OTP expired");
        if (record.otp !== otp)
            throw new Error("Invalid OTP");
        await this._otpRepository.deleteOtp(email, purpose);
        if (purpose === "signup") {
            const detected = await (0, user_utils_1.detectUserByEmail)(email, this._userRepos);
            console.log("Verifying email for user:", detected?.user._id, detected?.userType);
            if (detected) {
                const repo = this._userRepos[detected.userType];
                const updatedUser = await repo.verifyEmail?.(detected.user._id);
                if (updatedUser) {
                    console.log("Email verified successfully:", updatedUser.emailVerified);
                }
                else {
                    console.error("Failed to verify email");
                }
            }
        }
        return this._otpMapper.toVerifyOtpDTO();
    }
}
exports.OtpService = OtpService;
//# sourceMappingURL=otp.service.js.map