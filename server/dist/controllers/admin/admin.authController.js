"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const cookie_utils_1 = require("../../shared/utils/cookie.utils");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class AdminAuthController {
    constructor(_adminAuthService) {
        this._adminAuthService = _adminAuthService;
        //Admin Login
        this.login = async (req, res, next) => {
            try {
                const data = req.body;
                logger_1.logger.info("Starting admin login process", { email: data.email });
                const result = await this._adminAuthService.login(data);
                (0, cookie_utils_1.setAuthCookies)(res, result.refreshToken);
                logger_1.logger.info("Admin login successful", {
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
                    },
                    accessToken: result.accessToken,
                });
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : enums_1.ERROR_MESSAGES.INVALID_CREDENTIALS;
                logger_1.logger.error("Admin login failed", {
                    error: message,
                    email: req.body.email,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, message));
            }
        };
        //Admin logout
        this.logout = async (req, res, next) => {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (refreshToken) {
                    await this._adminAuthService.logout(refreshToken);
                    logger_1.logger.info("Admin logout successful");
                }
                (0, cookie_utils_1.clearAuthCookies)(res);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
                });
            }
            catch (error) {
                (0, cookie_utils_1.clearAuthCookies)(res);
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Admin logout failed", { error: message });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
    }
}
exports.AdminAuthController = AdminAuthController;
//# sourceMappingURL=admin.authController.js.map