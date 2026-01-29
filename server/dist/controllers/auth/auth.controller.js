"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const cookie_utils_1 = require("../../shared/utils/cookie.utils");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class AuthController {
    constructor(_authService) {
        this._authService = _authService;
        //Signup
        this.signup = async (req, res, next) => {
            try {
                const data = req.body;
                const result = await this._authService.signup(data);
                const userInfo = JSON.stringify({
                    _id: result.user._id,
                    email: result.user.email,
                    name: result.user.name,
                    role: data.userType,
                    profileImage: result.user.profileImage,
                    ...(data.userType === "Employer" && {
                        hasActiveSubscription: result.user
                            .hasActiveSubscription,
                        trialEndsAt: result.user.trialEndsAt,
                        currentPlan: result.user.currentPlan,
                    }),
                });
                (0, cookie_utils_1.setAuthCookies)(res, result.refreshToken, userInfo);
                logger_1.logger.info("User signup successful", {
                    userId: result.user._id,
                    email: data.email,
                });
                res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                    message: enums_1.SUCCESS_MESSAGES.USER_REGISTERED,
                    user: {
                        _id: result.user._id,
                        email: result.user.email,
                        name: result.user.name,
                        role: data.userType,
                        profileImage: result.user.profileImage,
                        ...(data.userType === "Employer" && {
                            hasActiveSubscription: result.user
                                .hasActiveSubscription,
                            trialEndsAt: result.user.trialEndsAt,
                            currentPlan: result.user.currentPlan,
                        }),
                    },
                    accessToken: result.accessToken,
                });
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : enums_1.ERROR_MESSAGES.VALIDATION_ERROR;
                logger_1.logger.error("Signup failed", { error: message, email: req.body.email });
                next(new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, message));
            }
        };
        //Login
        this.login = async (req, res, next) => {
            try {
                const data = req.body;
                const result = await this._authService.login(data);
                const userInfo = JSON.stringify({
                    _id: result.user._id,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role,
                    profileImage: result.user.profileImage,
                    ...(result.user.role === "Employer" && {
                        verified: result.user.verified,
                        hasActiveSubscription: result.user
                            .hasActiveSubscription,
                        trialEndsAt: result.user.trialEndsAt,
                        currentPlan: result.user.currentPlan,
                    }),
                });
                (0, cookie_utils_1.setAuthCookies)(res, result.refreshToken, userInfo);
                logger_1.logger.info("User login successful", {
                    userId: result.user._id,
                    email: data.email,
                });
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                    user: {
                        _id: result.user._id,
                        email: result.user.email,
                        name: result.user.name,
                        role: result.user.role,
                        profileImage: result.user.profileImage,
                        ...(result.user.role === "Employer" && {
                            verified: result.user.verified,
                            hasActiveSubscription: result.user
                                .hasActiveSubscription,
                            trialEndsAt: result.user.trialEndsAt,
                            currentPlan: result.user.currentPlan,
                        }),
                    },
                    accessToken: result.accessToken,
                });
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : enums_1.ERROR_MESSAGES.INVALID_CREDENTIALS;
                logger_1.logger.error("Login failed", { error: message, email: req.body.email });
                next(new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, message));
            }
        };
        //Refresh token
        this.refreshToken = async (req, res, next) => {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    res.status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED).json({
                        message: enums_1.ERROR_MESSAGES.NO_REFRESH_TOKEN,
                    });
                    return;
                }
                const result = await this._authService.refreshToken(refreshToken);
                const userInfo = JSON.stringify({
                    _id: result.user._id,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role,
                    profileImage: result.user.profileImage,
                    ...(result.user.role === "Employer" && {
                        verified: result.user.verified,
                        hasActiveSubscription: result.user
                            .hasActiveSubscription,
                        trialEndsAt: result.user.trialEndsAt,
                        currentPlan: result.user.currentPlan,
                    }),
                });
                (0, cookie_utils_1.setAuthCookies)(res, refreshToken, userInfo);
                logger_1.logger.info("Refresh token successful", { userId: result.user._id });
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    accessToken: result.accessToken,
                    user: {
                        _id: result.user._id,
                        email: result.user.email,
                        name: result.user.name,
                        role: result.user.role,
                        profileImage: result.user.profileImage,
                        ...(result.user.role === "Employer" && {
                            verified: result.user.verified,
                            hasActiveSubscription: result.user
                                .hasActiveSubscription,
                            trialEndsAt: result.user.trialEndsAt,
                            currentPlan: result.user.currentPlan,
                        }),
                    },
                });
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : enums_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN;
                logger_1.logger.error("Refresh token failed", { error: message });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, message));
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                const userInfo = req.cookies.userInfo;
                if (!userInfo) {
                    res.status(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED).json({
                        message: enums_1.ERROR_MESSAGES.NO_COOKIES,
                    });
                    return;
                }
                res.json({ user: JSON.parse(userInfo) });
                logger_1.logger.info("User info retrieved successfully");
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Get user info failed", { error: message });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Logout
        this.logout = async (req, res, next) => {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (refreshToken) {
                    await this._authService.logout(refreshToken);
                    logger_1.logger.info("Logout successful");
                }
                (0, cookie_utils_1.clearAuthCookies)(res);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
                });
            }
            catch (error) {
                logger_1.logger.error("Logout failed", {
                    error: error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map