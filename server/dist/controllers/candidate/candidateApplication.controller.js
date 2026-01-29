"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateApplicationsController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
const constants_1 = require("../../shared/constants/constants");
class CandidateApplicationsController {
    constructor(_service) {
        this._service = _service;
    }
    //Get applications of candidate
    async getMyApplications(req, res, next) {
        try {
            const candidateId = req.user.id;
            const { status, search, page = "1", limit = "10", } = req.query;
            let pageNum = parseInt(page, 10);
            let limitNum = parseInt(limit, 10);
            if (isNaN(pageNum) || pageNum < 1)
                pageNum = 1;
            if (isNaN(limitNum) || limitNum < 1)
                limitNum = 10;
            const filters = {
                page: pageNum,
                limit: limitNum,
            };
            if (search)
                filters.search = search;
            if (status && constants_1.ALLOWED_APPLICATION_STATUSES.includes(status)) {
                filters.status = status;
            }
            const result = await this._service.getApplicationsForCandidate(candidateId, filters);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
                ...result,
            });
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch candidate applications", { error: err });
            next(err);
        }
    }
    //Fetch single application
    async getApplicationById(req, res, next) {
        try {
            const { applicationId } = req.params;
            const candidateId = req.user.id;
            if (!applicationId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.VALIDATION_ERROR);
            }
            const application = await this._service.getApplicationById(applicationId, candidateId);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                success: true,
                message: enums_1.SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
                data: application,
            });
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch application by ID", {
                applicationId: req.params.applicationId,
                error: err,
            });
            next(err);
        }
    }
}
exports.CandidateApplicationsController = CandidateApplicationsController;
//# sourceMappingURL=candidateApplication.controller.js.map