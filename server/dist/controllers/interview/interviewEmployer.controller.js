"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerInterviewController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const enums_1 = require("../../shared/enums/enums");
const ApiError_1 = require("../../shared/utils/ApiError");
class EmployerInterviewController {
    constructor(_service) {
        this._service = _service;
    }
    //Fetch interview scheduled by employer
    async getInterviews(req, res, next) {
        try {
            const employerId = req.user.id;
            const { page, limit, search, status } = req.query;
            const filters = {
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 10,
                search: search,
                ...(status && { status: status }),
            };
            const result = await this._service.getInterviewsForEmployer(employerId, filters);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.INTERVIEWS_FETCHED,
                ...result,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch employer interviews", {
                error: message,
                employerId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    async updateInterviewStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!id || !status) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Interview ID and status are required");
            }
            const result = await this._service.updateInterviewStatus(id, status, req.user.id);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: "Interview status updated successfully",
                interview: result,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to update interview status", {
                error: message,
                interviewId: req.params.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.EmployerInterviewController = EmployerInterviewController;
//# sourceMappingURL=interviewEmployer.controller.js.map