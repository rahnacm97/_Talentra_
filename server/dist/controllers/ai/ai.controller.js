"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
const logger_1 = require("../../shared/utils/logger");
class AIController {
    constructor(_aiService, _candidateService, _jobService) {
        this._aiService = _aiService;
        this._candidateService = _candidateService;
        this._jobService = _jobService;
    }
    async getMatchScore(req, res, next) {
        try {
            const { candidateId, jobId } = req.body;
            if (!candidateId || !jobId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Candidate ID and Job ID are required");
            }
            const candidate = await this._candidateService.getCandidateById(candidateId);
            if (!candidate) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Candidate not found");
            }
            const job = await this._jobService.getJobById(jobId, candidateId);
            if (!job) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.JOB_NOT_FOUND);
            }
            const result = await this._aiService.calculateMatchScore(candidate, job.description, job.title);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json(result);
        }
        catch (error) {
            logger_1.logger.error("Error in getMatchScore", { error });
            next(error);
        }
    }
    async summarizeCandidate(req, res, next) {
        try {
            const { candidateId } = req.body;
            if (!candidateId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Candidate ID is required");
            }
            const candidate = await this._candidateService.getCandidateById(candidateId);
            if (!candidate) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Candidate not found");
            }
            const summary = await this._aiService.generateCandidateSummary(candidate);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({ summary });
        }
        catch (error) {
            logger_1.logger.error("Error in summarizeCandidate", { error });
            next(error);
        }
    }
}
exports.AIController = AIController;
//# sourceMappingURL=ai.controller.js.map