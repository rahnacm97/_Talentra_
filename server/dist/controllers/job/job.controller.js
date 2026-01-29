"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJobController = exports.CandidateJobController = exports.EmployerJobController = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const enums_1 = require("../../shared/enums/enums");
class EmployerJobController {
    constructor(_service) {
        this._service = _service;
    }
    getEmployerId(req) {
        const id = req.user?.id;
        if (!id)
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.EMPOYER_ID);
        return id;
    }
    getJobId(req) {
        const id = req.params.jobId;
        if (!id)
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.JOB_ID);
        return id;
    }
    //Employer post job
    async postJob(req, res, next) {
        const employerId = this.getEmployerId(req);
        try {
            logger_1.logger.info("Employer posting job", { employerId, body: req.body });
            const job = await this._service.createJob(employerId, req.body);
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.JOB_POST_SUCCESS,
                job,
            });
        }
        catch (err) {
            logger_1.logger.error("Failed to post job", { employerId, error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
    //Employer fetch jobs
    async getJobs(req, res, next) {
        const employerId = this.getEmployerId(req);
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const status = req.query.status;
            const data = await this._service.getJobsPaginated(employerId, page, limit, search, status === "all" ? undefined : status);
            res.json(data);
        }
        catch (err) {
            console.error("ERROR in getJobs controller:", err);
            logger_1.logger.error("Failed to fetch employer jobs", { employerId, error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
    //Employer update job
    async updateJob(req, res, next) {
        const employerId = this.getEmployerId(req);
        const jobId = this.getJobId(req);
        try {
            const payload = Object.fromEntries(Object.entries(req.body).filter(([, v]) => v !== undefined));
            const job = await this._service.updateJob(employerId, jobId, payload);
            res.json({ message: enums_1.SUCCESS_MESSAGES.JOB_UPDATED, job });
        }
        catch (err) {
            logger_1.logger.error("Failed to update job", { employerId, jobId, error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
    //Employer close job
    async closeJob(req, res, next) {
        const employerId = this.getEmployerId(req);
        const jobId = this.getJobId(req);
        try {
            const job = await this._service.closeJob(employerId, jobId);
            res.json({ message: "Job closed successfully", job });
        }
        catch (err) {
            logger_1.logger.error("Failed to close job", { employerId, jobId, error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
}
exports.EmployerJobController = EmployerJobController;
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
class AdminJobController {
    constructor(_service) {
        this._service = _service;
    }
    //Admin fetch jobs
    async getAdminJobs(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const search = req.query.search;
            const status = req.query.status;
            const params = { page, limit };
            if (search?.trim())
                params.search = search.trim();
            if (status)
                params.status = status;
            const result = await this._service.getAllJobsForAdmin(params);
            res.json(result);
        }
        catch (err) {
            logger_1.logger.error("Failed to fetch admin jobs", { error: err });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.SERVER_ERROR));
        }
    }
}
exports.AdminJobController = AdminJobController;
//# sourceMappingURL=job.controller.js.map