"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerJobController = void 0;
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
//# sourceMappingURL=employerJob.controller.js.map