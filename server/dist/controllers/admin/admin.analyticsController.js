"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class AdminAnalyticsController {
    constructor(_analyticsService) {
        this._analyticsService = _analyticsService;
        //Fetching dashboard informations
        this.getDashboardAnalytics = async (req, res, next) => {
            try {
                logger_1.logger.info("Admin requested dashboard analytics");
                const timeRange = req.query.timeRange || "30days";
                const analytics = await this._analyticsService.getDashboardAnalytics(timeRange);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: enums_1.SUCCESS_MESSAGES.FETCH_SUCCESS,
                    data: analytics,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to fetch dashboard analytics", {
                    error: message,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
    }
}
exports.AdminAnalyticsController = AdminAnalyticsController;
//# sourceMappingURL=admin.analyticsController.js.map