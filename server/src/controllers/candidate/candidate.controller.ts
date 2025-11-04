import { NextFunction, Request, Response } from "express";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../shared/constants/constants";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import {
  ICandidateController,
  UpdateProfileResponse,
} from "../../interfaces/users/candidate/ICandidateController";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { IApplicationService } from "../../interfaces/applications/IApplicationService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { error } from "console";
import { ProfileData } from "../../types/candidate/candidate.types";
import { ApplicationResponseDto } from "../../dto/application/application.dto";

export class CandidateController implements ICandidateController {
  constructor(
    private _candidateService: ICandidateService,
    private _applicationService: IApplicationService,
  ) {}
  async getProfile(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = req.params.id;
      if (!candidateId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.VALIDATION_ERROR,
        );
      }
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
        candidateId: req.params.id,
      });
      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
      return;
    }
  }

  async updateProfile(
    req: Request<{ id: string }, UpdateProfileResponse, ProfileData>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = req.params.id;
      if (!candidateId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.VALIDATION_ERROR,
        );
      }
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
        candidateId: req.params.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async applyJob(
    req: Request<{ candidateId: string; jobId: string }>,
    res: Response<{ message: string; data: ApplicationResponseDto }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { jobId } = req.params;
      const candidateId = (req.user as { id: string; role: string }).id;

      if (req.params.candidateId !== candidateId) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.NOT_AUTHENTICATED);
      }

      const { fullName, email, phone, coverLetter } = req.body;
      const resumeFile = req.file as Express.Multer.File;

      if (!resumeFile) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.RESUME_REQUIRED);
      }

      const application = await this._applicationService.apply(
        jobId,
        candidateId,
        {
          fullName,
          email,
          phone,
          coverLetter,
          resumeFile,
        },
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
