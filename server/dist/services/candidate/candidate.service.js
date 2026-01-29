"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
const logger_1 = require("../../shared/utils/logger");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const promises_1 = __importDefault(require("fs/promises"));
class CandidateService {
    constructor(_repository, _candidateMapper) {
        this._repository = _repository;
        this._candidateMapper = _candidateMapper;
    }
    async getCandidateById(candidateId) {
        return this._repository.findById(candidateId);
    }
    //File uploading
    async uploadFile(file) {
        try {
            const transformation = file.fieldname === "profileImage"
                ? { width: 512, height: 512, crop: "fill", quality: "auto" }
                : undefined;
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
                folder: "candidate_uploads",
                access_mode: "public",
                ...(transformation ? { transformation } : {}),
            });
            await promises_1.default.unlink(file.path).catch((err) => {
                logger_1.logger.warn("Failed to delete temporary file", {
                    error: err.message,
                    path: file.path,
                });
            });
            return result.secure_url;
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : enums_1.ERROR_MESSAGES.CLOUDINARY_ERROR;
            logger_1.logger.error("Failed to upload file to Cloudinary", { error: message });
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
    }
    //Candidate profile updation
    async updateProfile(userId, data, resumeFile, profileImageFile) {
        const candidate = await this._repository.findById(userId);
        if (!candidate) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Candidate not found");
        }
        if (candidate.blocked) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, "User is blocked");
        }
        if (resumeFile) {
            data.resume = await this.uploadFile(resumeFile);
        }
        if (profileImageFile) {
            data.profileImage = await this.uploadFile(profileImageFile);
        }
        const updatedCandidate = await this._repository.updateProfile(userId, data);
        if (!updatedCandidate) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update profile");
        }
        logger_1.logger.info("Candidate profile updated", { userId });
        return this._candidateMapper.toProfileDataDTO(updatedCandidate);
    }
}
exports.CandidateService = CandidateService;
//# sourceMappingURL=candidate.service.js.map