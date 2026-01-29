"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const enums_1 = require("../../shared/enums/enums");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const ApiError_1 = require("../../shared/utils/ApiError");
class CandidateController {
    constructor(_candidateService, _applicationService) {
        this._candidateService = _candidateService;
        this._applicationService = _applicationService;
    }
    //Fetching candidate profile
    async getProfile(req, res, next) {
        try {
            const candidateId = req.user.id;
            logger_1.logger.info("Fetching candidate profile", { candidateId });
            const candidate = await this._candidateService.getCandidateById(candidateId);
            if (!candidate) {
                logger_1.logger.warn("Candidate not found", { candidateId });
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.EMAIL_NOT_EXIST);
            }
            if (candidate.blocked) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.USER_BLOCKED);
            }
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.CANDIDATE_FETCHED,
                data: candidate,
            });
            return;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to fetch candidate profile", {
                error: message,
                candidateId: req.user.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
            return;
        }
    }
    //Updating candidate profile
    async updateProfile(req, res, next) {
        try {
            const candidateId = req.user.id;
            const profileData = req.body;
            logger_1.logger.info("Updating candidate profile", { candidateId });
            const files = req.files;
            const updatedProfile = await this._candidateService.updateProfile(candidateId, profileData, files?.["resume"]?.[0], files?.["profileImage"]?.[0]);
            res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                message: enums_1.SUCCESS_MESSAGES.CANDIDATE_UPDATED,
                data: updatedProfile,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : enums_1.ERROR_MESSAGES.SERVER_ERROR;
            logger_1.logger.error("Failed to update candidate profile", {
                error: message,
                candidateId: req.user.id,
            });
            next(err instanceof ApiError_1.ApiError
                ? err
                : new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message));
        }
    }
    //Apply job
    async applyJob(req, res, next) {
        try {
            const { jobId } = req.params;
            const candidateId = req.user.id;
            const { fullName, email, phone, coverLetter, useExistingResume } = req.body;
            const resumeFile = req.file;
            const payload = {
                fullName,
                email,
                phone,
                coverLetter: coverLetter || "",
            };
            if (resumeFile) {
                payload.resumeFile = resumeFile;
            }
            else if (useExistingResume === "true" || useExistingResume === true) {
                payload.useExistingResume = true;
            }
            else {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.RESUME_REQUIRED);
            }
            const application = await this._applicationService.apply(jobId, candidateId, payload);
            res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                message: enums_1.SUCCESS_MESSAGES.APPLICATION_CREATED,
                data: application,
            });
        }
        catch (err) {
            logger_1.logger.error("Apply job failed", { error: err });
            next(err);
        }
    }
}
exports.CandidateController = CandidateController;
//# sourceMappingURL=candidate.controller.js.map