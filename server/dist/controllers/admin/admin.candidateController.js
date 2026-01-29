"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCandidateController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class AdminCandidateController {
    constructor(_candidateService) {
        this._candidateService = _candidateService;
        //Admin fetch all candidates
        this.getAllCandidates = async (req, res, next) => {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const search = req.query.search;
                const status = req.query.status;
                logger_1.logger.info("Fetching all candidates", { page, limit, search, status });
                const result = await this._candidateService.getAllCandidates(page, limit, search, status === "all" ? undefined : status);
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ message: enums_1.SUCCESS_MESSAGES.FETCH_SUCCESS, data: result });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to fetch candidates", {
                    error: message,
                    page: req.query.page,
                    limit: req.query.limit,
                    search: req.query.search,
                    status: req.query.status,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //fetch single candidate
        this.getCandidateById = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.REQUIRED_ID);
                }
                logger_1.logger.info("Fetching candidate by ID", { candidateId: id });
                const candidate = await this._candidateService.getCandidateById(id);
                if (!candidate) {
                    throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMAIL_NOT_EXIST);
                }
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.FETCH_SUCCESS,
                    data: candidate,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to fetch candidate by ID", {
                    error: message,
                    candidateId: req.params.id,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
        //Block unblock candidate
        this.blockUnblockCandidate = async (req, res, next) => {
            try {
                const data = req.body;
                const candidate = await this._candidateService.blockUnblockCandidate(data);
                logger_1.logger.info("Candidate blocked", { candidateId: data.candidateId });
                res
                    .status(httpStatusCode_1.HTTP_STATUS.OK)
                    .json({ candidate, message: enums_1.SUCCESS_MESSAGES.STATUS_UPDATED });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
                logger_1.logger.error("Failed to block/unblock candidate", {
                    error: message,
                    candidateId: req.body.candidateId,
                });
                next(error instanceof ApiError_1.ApiError
                    ? error
                    : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            }
        };
    }
}
exports.AdminCandidateController = AdminCandidateController;
//# sourceMappingURL=admin.candidateController.js.map