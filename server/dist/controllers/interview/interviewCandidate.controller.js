"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const enums_1 = require("../../shared/enums/enums");
const ApiError_1 = require("../../shared/utils/ApiError");
class CandidateInterviewController {
    constructor(_service) {
        this._service = _service;
    }
    //Fetch candidate interviews
    async getMyInterviews(req, res, next) {
        try {
            const candidateId = req.user.id;
            const { page, limit, search, status } = req.query;
            const filters = {
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 10,
                search: search,
                ...(status && { status: status }),
            };
            const result = await this._service.getInterviewsForCandidate(candidateId, filters);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.INTERVIEWS_FETCHED,
                ...result,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch candidate interviews", {
                error: message,
                candidateId: req.user?.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
}
exports.CandidateInterviewController = CandidateInterviewController;
//# sourceMappingURL=interviewCandidate.controller.js.map