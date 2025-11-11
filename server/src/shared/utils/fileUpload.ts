import cloudinary from "../../config/cloudinary";
import fs from "fs/promises";
import { UploadApiResponse } from "cloudinary";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../enums/enums";
import { logger } from "../../shared/utils/logger";

export async function uploadResumeFile(
  file: Express.Multer.File,
): Promise<string> {
  try {
    if (!file) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No file uploaded");
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      file.path,
      {
        resource_type: "raw",
        folder: "job_applications/resumes",
        access_mode: "public",
      },
    );

    await fs.unlink(file.path).catch((err) => {
      logger.warn("Failed to delete temporary resume file", {
        error: err.message,
        path: file.path,
      });
    });

    return result.secure_url;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : ERROR_MESSAGES.CLOUDINARY_ERROR;

    logger.error("Resume upload to Cloudinary failed", { error: message });

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to upload resume file",
    );
  }
}
