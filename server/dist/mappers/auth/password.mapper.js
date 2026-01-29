"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordMapper = void 0;
class PasswordMapper {
    toRequestResetResponseDTO() {
        return {
            success: true,
            message: "OTP sent successfully",
        };
    }
    toResetPasswordResponseDTO() {
        return {
            success: true,
            message: "Password reset successfully",
        };
    }
}
exports.PasswordMapper = PasswordMapper;
//# sourceMappingURL=password.mapper.js.map