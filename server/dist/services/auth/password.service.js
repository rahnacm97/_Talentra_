"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const user_utils_1 = require("../../shared/utils/user.utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordService {
    constructor(_otpService, _userRepos, _passwordMapper) {
        this._otpService = _otpService;
        this._userRepos = _userRepos;
        this._passwordMapper = _passwordMapper;
    }
    //Password reset
    async requestReset(data) {
        const detected = await (0, user_utils_1.detectUserByEmail)(data.email, this._userRepos);
        if (!detected)
            throw new Error("User not found");
        await this._otpService.generateOtp(data.email, "forgot-password");
        return this._passwordMapper.toRequestResetResponseDTO();
    }
    //Resetting password
    async resetPassword(data) {
        const detected = await (0, user_utils_1.detectUserByEmail)(data.email, this._userRepos);
        if (!detected)
            throw new Error("User not found");
        const { user } = detected;
        const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return this._passwordMapper.toResetPasswordResponseDTO();
    }
}
exports.PasswordService = PasswordService;
//# sourceMappingURL=password.service.js.map