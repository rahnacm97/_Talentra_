"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class EmployerController {
    constructor(_employerService) {
        this._employerService = _employerService;
    }
    //Employer fetch profile
    async getProfile(req, res, next) {
        try {
            const employerId = req.user.id;
            logger_1.logger.info("Fetching candidate profile", { employerId });
            const employer = await this._employerService.getEmployerById(employerId);
            if (!employer) {
                logger_1.logger.warn("Employer not found", { employerId });
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMAIL_NOT_EXIST);
            }
            if (employer.blocked) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.USER_BLOCKED);
            }
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.EMPLOYER_FETCHED,
                data: employer,
            });
            return;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch candidate profile", {
                error: message,
                employerId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            return;
        }
    }
    //Employer profile update
    async updateProfile(req, res, next) {
        try {
            const employerId = req.user.id;
            const profileData = req.body;
            logger_1.logger.info("Updating employer profile", { employerId });
            const files = req.files;
            const updatedProfile = await this._employerService.updateProfile(employerId, profileData, files?.["businessLicense"]?.[0], files?.["profileImage"]?.[0]);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.EMPLOYER_UPDATED,
                data: updatedProfile,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to update employer profile", {
                error: message,
                employerId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.EmployerController = EmployerController;
//# sourceMappingURL=employer.controller.js.map