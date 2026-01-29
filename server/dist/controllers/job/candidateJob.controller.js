"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateJobController = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const enums_1 = require("../../shared/enums/enums");
class CandidateJobController {
    constructor(_service) {
        this._service = _service;
    }
    //candidate fetch jobs
    async getPublicJobs(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const location = req.query.location;
            const type = req.query.type;
            const experience = req.query.experience;
            const skills = req.query.skills;
            const params = { page, limit };
            if (search?.trim())
                params.search = search.trim();
            if (location?.trim())
                params.location = location.trim();
            if (type && type !== "all")
                params.type = type;
            if (experience)
                params.experience = experience;
            if (skills) {
                params.skills = skills
                    .split(",")
                    .map((s) => s.trim().toLowerCase())
                    .filter(Boolean);
            }
            const result = await this._service.getPublicJobs(params);
            logger_1.logger.info("Public jobs fetched", {
                count: result.jobs.length,
                page,
                limit,
                skills: params.skills,
            });
            res.json(result);
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch public jobs", { error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to fetch jobs"));
        }
    }
    //Candidate fetch single job
    async getJobById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id)
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.JOB_ID);
            const candidateId = req.user?.id;
            const job = await this._service.getJobById(id, candidateId);
            res.json({ success: true, data: job });
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch job by ID", {
                jobId: req.params.id,
                error: err,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
    //Save job
    async saveJob(req, res, next) {
        try {
            const candidateId = req.user?.id;
            const { jobId } = req.params;
            if (!candidateId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
            }
            if (!jobId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.JOB_ID);
            }
            await this._service.saveJob(candidateId, jobId);
            res.json({ success: true, message: "Job saved successfully" });
        }
        catch (err) {
            logger_1.logger.error("Failed to save job", {
                candidateId: req.user?.id,
                jobId: req.params.jobId,
                error: err,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
    //unsave the saved job
    async unsaveJob(req, res, next) {
        try {
            const candidateId = req.user?.id;
            const { jobId } = req.params;
            if (!candidateId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
            }
            if (!jobId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.JOB_ID);
            }
            await this._service.unsaveJob(candidateId, jobId);
            res.json({ success: true, message: "Job unsaved successfully" });
        }
        catch (err) {
            logger_1.logger.error("Failed to unsave job", {
                candidateId: req.user?.id,
                jobId: req.params.jobId,
                error: err,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
    //fetching saved jobs
    async getSavedJobs(req, res, next) {
        try {
            const candidateId = req.user?.id;
            if (!candidateId) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.UNAUTHORIZED, enums_1.ERROR_MESSAGES.AUTHENTICATION);
            }
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const type = req.query.type;
            const params = { page, limit };
            if (search)
                params.search = search;
            if (type && type !== "all")
                params.type = type;
            const result = await this._service.getSavedJobs(candidateId, params);
            res.json({ success: true, data: result });
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch saved jobs", {
                candidateId: req.user?.id,
                error: err,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
}
exports.CandidateJobController = CandidateJobController;
//# sourceMappingURL=candidateJob.controller.js.map