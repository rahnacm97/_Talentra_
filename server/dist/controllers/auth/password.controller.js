"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class PasswordController {
    constructor(_passwordService) {
        this._passwordService = _passwordService;
        //Password Resting request
        this.requestReset = async (req, res, next) => {
            try {
                const { email } = req.body;
                const result = await this._passwordService.requestReset(req.body);
                logger_1.logger.info("Requesting password reset", { email });
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ message: enums_1.SUCCESS_MESSAGES.SEND_OTP_TO_MAIL, data: result });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to request password reset", {
                    error: message,
                    email: req.body.email,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, message));
            }
        };
        //Reset password
        this.resetPassword = async (req, res, next) => {
            try {
                await this._passwordService.resetPassword(req.body);
                logger_1.logger.info("Resetting password");
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ message: enums_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to request password reset", {
                    error: message,
                    email: req.body.email,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, message));
            }
        };
    }
}
exports.PasswordController = PasswordController;
//# sourceMappingURL=password.controller.js.map