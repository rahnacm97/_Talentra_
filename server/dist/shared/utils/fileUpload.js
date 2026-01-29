"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResumeFile = uploadResumeFile;
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const promises_1 = __importDefault(require("fs/promises"));
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../enums/enums");
const logger_1 = require("../../shared/utils/logger");
async function uploadResumeFile(file) {
    try {
        if (!file) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "No file uploaded");
        }
        const result = await cloudinary_1.default.uploader.upload(file.path, {
            resource_type: "raw",
            folder: "job_applications/resumes",
            access_mode: "public",
        });
        await promises_1.default.unlink(file.path).catch((err) => {
            logger_1.logger.warn("Failed to delete temporary resume file", {
                error: err.message,
                path: file.path,
            });
        });
        return result.secure_url;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : enums_1.ERROR_MESSAGES.CLOUDINARY_ERROR;
        logger_1.logger.error("Resume upload to Cloudinary failed", { error: message });
        throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to upload resume file");
    }
}
//# sourceMappingURL=fileUpload.js.map