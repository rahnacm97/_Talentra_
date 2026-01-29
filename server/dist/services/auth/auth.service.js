"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_utils_1 = require("../../shared/utils/user.utils");
const types_1 = require("../../type/types");
class AuthService {
    constructor(_repos, _tokenService) {
        this._repos = _repos;
        this._tokenService = _tokenService;
    }
    getRepository(userType) {
        const repo = this._repos[userType];
        if (!repo)
            throw new Error("Invalid user type");
        return repo;
    }
    //Signup
    async signup(data) {
        const detected = await (0, user_utils_1.detectUserByEmail)(data.email, this._repos);
        if (detected) {
            throw new Error("Email already exists in another account");
        }
        const repo = this.getRepository(data.userType);
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const userData = { ...data, password: hashedPassword };
        if (data.userType === "Employer") {
            const trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + 30);
            userData.trialEndsAt = trialEndsAt;
            userData.hasActiveSubscription = false;
        }
        const user = await repo.create(userData);
        const blocked = (0, types_1.hasEmailVerification)(user) ? user.blocked : false;
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: data.userType,
                blocked,
                emailVerified: false,
                ...(data.userType === "Employer" && {
                    verified: false,
                    hasActiveSubscription: user.hasActiveSubscription,
                    trialEndsAt: user.trialEndsAt,
                    currentPlan: user.currentPlan,
                }),
                profileImage: user.profileImage,
            },
            accessToken: this._tokenService.generateAccessToken({
                id: user._id,
                email: user.email,
                role: data.userType,
                ...(data.userType === "Employer" && {
                    hasActiveSubscription: user.hasActiveSubscription,
                    trialEndsAt: user.trialEndsAt,
                    currentPlan: user.currentPlan,
                }),
            }),
            refreshToken: this._tokenService.generateRefreshToken({
                id: user._id,
                email: user.email,
                role: data.userType,
            }),
        };
    }
    //Login
    async login(data) {
        const detected = await (0, user_utils_1.detectUserByEmail)(data.email, this._repos);
        if (!detected)
            throw new Error("User not found");
        const { user, userType: role } = detected;
        if (role === "Admin") {
            throw new Error("Admin login requires alternative authentication");
        }
        if (!user.password) {
            throw new Error("Invalid credentials");
        }
        const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isMatch)
            throw new Error("Invalid credentials");
        if (user.blocked) {
            throw new Error("You have been blocked by the admin");
        }
        if (!user.emailVerified) {
            throw new Error("Please verify your email");
        }
        if ((0, types_1.hasEmailVerification)(user)) {
            if (user.blocked) {
                throw new Error("You have been blocked by the admin");
            }
            if (!user.emailVerified) {
                throw new Error("Please verify your email");
            }
        }
        const emailVerified = (0, types_1.hasEmailVerification)(user)
            ? user.emailVerified
            : false;
        const blocked = (0, types_1.hasEmailVerification)(user) ? user.blocked : false;
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role,
                blocked,
                emailVerified,
                ...(role === "Employer" && {
                    verified: user.verified,
                    hasActiveSubscription: user.hasActiveSubscription,
                    trialEndsAt: user.trialEndsAt,
                    currentPlan: user.currentPlan,
                }),
                profileImage: user.profileImage,
            },
            accessToken: this._tokenService.generateAccessToken({
                id: user._id,
                email: user.email,
                role,
            }),
            refreshToken: this._tokenService.generateRefreshToken({
                id: user._id,
                email: user.email,
                role,
            }),
        };
    }
    async refreshToken(refreshToken) {
        const decoded = this._tokenService.verifyRefreshToken(refreshToken);
        if (this._tokenService.isTokenInvalidated(refreshToken)) {
            throw new Error("Token has been invalidated");
        }
        const repo = this.getRepository(decoded.role);
        const user = await repo.findById(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }
        if (decoded.role !== "Admin" && user.blocked) {
            throw new Error("You have been blocked by admin");
        }
        const newAccessToken = this._tokenService.generateAccessToken({
            id: user._id,
            email: user.email,
            role: decoded.role,
        });
        return {
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: decoded.role,
                blocked: decoded.role !== "Admin"
                    ? user.blocked || false
                    : false,
                ...(decoded.role === "Employer" && {
                    verified: user.verified,
                    hasActiveSubscription: user.hasActiveSubscription,
                    trialEndsAt: user.trialEndsAt,
                    currentPlan: user.currentPlan,
                }),
                profileImage: user.profileImage,
            },
        };
    }
    //Logout
    async logout(refreshToken) {
        this._tokenService.invalidateToken(refreshToken);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map