import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ICandidateMapper } from "../../interfaces/users/candidate/ICandidateMapper";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";
import { ProfileDataDTO } from "../../dto/candidate/candidate.dto";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import fs from "fs/promises";

export class CandidateService implements ICandidateService {
  constructor(
    private _repository = new CandidateRepository(),
    private _candidateMapper: ICandidateMapper,
  ) {}

  async getCandidateById(candidateId: string): Promise<ICandidate | null> {
    return this._repository.findById(candidateId);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const transformation: UploadApiOptions["transformation"] | undefined =
        file.fieldname === "profileImage"
          ? { width: 512, height: 512, crop: "fill", quality: "auto" }
          : undefined;
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        file.path,
        {
          resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
          folder: "candidate_uploads",
          access_mode: "public",
          ...(transformation ? { transformation } : {}),
        },
      );
      await fs.unlink(file.path).catch((err) => {
        logger.warn("Failed to delete temporary file", {
          error: err.message,
          path: file.path,
        });
      });
      return result.secure_url;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.CLOUDINARY_ERROR;
      logger.error("Failed to upload file to Cloudinary", { error: message });
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to upload file",
      );
    }
  }

  async updateProfile(
    userId: string,
    data: ProfileDataDTO,
    resumeFile?: Express.Multer.File,
    profileImageFile?: Express.Multer.File,
  ): Promise<ProfileDataDTO> {
    const candidate = await this._repository.findById(userId);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Candidate not found");
    }
    if (candidate.blocked) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "User is blocked");
    }
    if (resumeFile) {
      data.resume = await this.uploadFile(resumeFile);
    }
    if (profileImageFile) {
      data.profileImage = await this.uploadFile(profileImageFile);
    }
    const updatedCandidate = await this._repository.updateProfile(userId, data);
    if (!updatedCandidate) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to update profile",
      );
    }
    logger.info("Candidate profile updated", { userId });
    return this._candidateMapper.toProfileDataDTO(updatedCandidate);
  }
}
