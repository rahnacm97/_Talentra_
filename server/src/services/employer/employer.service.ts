import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IEmployerMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";
import { EmployerDataDTO } from "../../dto/employer/employer.dto";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import fs from "fs/promises";

export class EmployerService implements IEmployerService {
  constructor(
    private _repository = new EmployerRepository(),
    private _employerMapper: IEmployerMapper,
  ) {}

  async getEmployerById(employerId: string): Promise<IEmployer | null> {
    return this._repository.findById(employerId);
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
          folder: "employer_uploads",
          access_mode: "authenticated",
          ...(transformation ? { transformation } : {}),
        },
      );
      await fs.unlink(file.path).catch((err) => {
        logger.warn("Failed to delete temporary file", {
          error: err.message,
          path: file.path,
        });
      });
      logger.info("File uploaded to Cloudinary", { url: result.secure_url });
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
    employerId: string,
    data: EmployerDataDTO,
    businessLicenseFile?: Express.Multer.File,
    profileImageFile?: Express.Multer.File,
  ): Promise<EmployerDataDTO> {
    const employer = await this._repository.findById(employerId);
    if (!employer) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employer not found");
    }
    if (employer.blocked) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "User is blocked");
    }
    if (typeof data.benefits === "string") {
      try {
        data.benefits = JSON.parse(data.benefits);
      } catch {
        data.benefits = [];
      }
    }

    if (typeof data.socialLinks === "string") {
      try {
        data.socialLinks = JSON.parse(data.socialLinks);
      } catch {
        data.socialLinks = {};
      }
    }
    if (businessLicenseFile) {
      data.businessLicense = await this.uploadFile(businessLicenseFile);
    }
    if (profileImageFile) {
      data.profileImage = await this.uploadFile(profileImageFile);
    }
    const updatedEmployer = await this._repository.updateProfile(
      employerId,
      data,
    );
    if (!updatedEmployer) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to update profile",
      );
    }
    logger.info("Employer profile updated", { employerId });
    return this._employerMapper.toProfileDataDTO(updatedEmployer);
  }
}
