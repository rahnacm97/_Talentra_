"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class OtpController {
    constructor(_otpService) {
        this._otpService = _otpService;
        //Otp send
        this.sendOtp = async (req, res, next) => {
            try {
                const { email, purpose } = req.body;
                const result = await this._otpService.generateOtp(email, purpose);
                logger_1.logger.info("Generating OTP", { email, purpose });
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.SEND_OTP_TO_MAIL,
                    data: result,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to generate OTP", {
                    error: message,
                    email: req.body.email,
                    purpose: req.body.purpose,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, message));
            }
        };
        //Otp verification
        this.verifyOtp = async (req, res, next) => {
            try {
                const { email, purpose, otp } = req.body;
                const result = await this._otpService.verifyOtp(email, purpose, otp);
                logger_1.logger.info("Verifying OTP", { email, purpose, otp });
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.OTP_VERIFIED,
                    data: result,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.INVALID_OTP;
                logger_1.logger.error("Failed to verify OTP", {
                    error: message,
                    email: req.body.email,
                    purpose: req.body.purpose,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, message));
            }
        };
    }
}
exports.OtpController = OtpController;
//# sourceMappingURL=otp.controller.js.map