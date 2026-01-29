"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerAnalyticsController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class EmployerAnalyticsController {
    constructor(_analyticsService) {
        this._analyticsService = _analyticsService;
        this.getEmployerAnalytics = async (req, res, next) => {
            try {
                const employerId = req.user?.id;
                if (!employerId) {
                    logger_1.logger.warn("Unauthorized access attempt to employer analytics", {
                        ip: req.ip,
                        path: req.path,
                    });
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
                }
                const timeRange = req.query.timeRange || "30d";
                logger_1.logger.info("Employer requested analytics dashboard", {
                    employerId,
                    timeRange,
                });
                const analytics = await this._analyticsService.getEmployerAnalytics(employerId, timeRange);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: enums_1.SUCCESS_MESSAGES.FETCH_SUCCESS,
                    data: analytics,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to fetch employer analytics", {
                    error: message,
                    timeRange: req.query.timeRange,
                    path: req.path,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
    }
}
exports.EmployerAnalyticsController = EmployerAnalyticsController;
//# sourceMappingURL=employerAnalytics.controller.js.map