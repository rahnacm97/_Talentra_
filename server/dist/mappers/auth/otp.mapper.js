"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpMapper = void 0;
class OtpMapper {
    toSendOtpDTO() {
        return {
            message: "OTP sent successfully",
        };
    }
    toVerifyOtpDTO() {
        return {
            success: true,
            message: "OTP verified successfully",
        };
    }
}
exports.OtpMapper = OtpMapper;
//# sourceMappingURL=otp.mapper.js.map