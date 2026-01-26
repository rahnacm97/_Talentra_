import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ICandidateController } from "../../interfaces/users/candidate/ICandidateController";
import { UpdateProfileResponse } from "../../type/candidate/candidate.types";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { ApplyJobPayload } from "../../interfaces/applications/IApplicationService";
import { ICandidateApplicationService } from "../../interfaces/applications/IApplicationService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { ProfileData } from "../../type/candidate/candidate.types";
import { ApplicationResponseDto } from "../../dto/application/application.dto";

export class CandidateController implements ICandidateController {
  constructor(
    private _candidateService: ICandidateService,
    private _applicationService: ICandidateApplicationService,
  ) {}
  //Fetching candidate profile
  async getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as { id: string }).id;

      logger.info("Fetching candidate profile", { candidateId });
      const candidate =
        await this._candidateService.getCandidateById(candidateId);
      if (!candidate) {
        logger.warn("Candidate not found", { candidateId });
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.EMAIL_NOT_EXIST,
        );
      }

      if (candidate.blocked) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.USER_BLOCKED);
      }
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.CANDIDATE_FETCHED,
        data: candidate,
      });

      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch candidate profile", {
        error: message,
        candidateId: (req.user as { id: string }).id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
      return;
    }
  }
  //Updating candidate profile
  async updateProfile(
    req: Request<{ id: string }, UpdateProfileResponse, ProfileData>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as { id: string }).id;

      const profileData = req.body;
      logger.info("Updating candidate profile", { candidateId });
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updatedProfile = await this._candidateService.updateProfile(
        candidateId,
        profileData,
        files?.["resume"]?.[0],
        files?.["profileImage"]?.[0],
      );
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.CANDIDATE_UPDATED,
        data: updatedProfile,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to update candidate profile", {
        error: message,
        candidateId: (req.user as { id: string }).id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
  //Apply job
  async applyJob(
    req: Request<{ jobId: string }>,
    res: Response<{ message: string; data: ApplicationResponseDto }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { jobId } = req.params;
      const candidateId = (req.user as { id: string }).id;
      const { fullName, email, phone, coverLetter, useExistingResume } =
        req.body;
      const resumeFile = req.file as Express.Multer.File | undefined;

      const payload: ApplyJobPayload = {
        fullName,
        email,
        phone,
        coverLetter: coverLetter || "",
      };

      if (resumeFile) {
        payload.resumeFile = resumeFile;
      } else if (useExistingResume === "true" || useExistingResume === true) {
        payload.useExistingResume = true;
      } else {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.RESUME_REQUIRED,
        );
      }

      const application = await this._applicationService.apply(
        jobId,
        candidateId,
        payload,
      );

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.APPLICATION_CREATED,
        data: application,
      });
    } catch (err) {
      logger.error("Apply job failed", { error: err });
      next(err);
    }
  }
}
