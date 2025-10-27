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
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { error } from "console";
import { ProfileData } from "../../types/candidate/candidate.types";

export class CandidateController implements ICandidateController {
  constructor(private _candidateService: ICandidateService) {}
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
}
