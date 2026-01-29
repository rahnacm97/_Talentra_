"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMapper = void 0;
const types_1 = require("../../type/types");
class AuthMapper {
    toAuthResponse(user, role) {
        const blocked = (0, types_1.hasEmailVerification)(user) ? user.blocked : false;
        const emailVerified = (0, types_1.hasEmailVerification)(user)
            ? user.emailVerified
            : false;
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role,
            blocked,
            emailVerified,
        };
    }
    toRefreshTokenResponse(user, role) {
        const blocked = (0, types_1.hasEmailVerification)(user) ? user.blocked : false;
        const emailVerified = (0, types_1.hasEmailVerification)(user)
            ? user.emailVerified
            : false;
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role,
            blocked,
            emailVerified,
        };
    }
    toSignupEntity(dto) {
        return {
            email: dto.email,
            password: dto.password,
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            emailVerified: dto.emailVerified ?? false,
        };
    }
    toLoginEntity(dto) {
        return {
            email: dto.email,
            password: dto.password,
        };
    }
}
exports.AuthMapper = AuthMapper;
//# sourceMappingURL=auth.mapper.js.map