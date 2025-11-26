import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import {
  ICandidateController,
  ICandidateApplicationController,
} from "../../interfaces/users/candidate/ICandidateController";
import { UpdateProfileResponse } from "../../type/candidate/candidate.types";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { IApplicationQueryParams } from "../../interfaces/applications/IApplication";
import { ApplyJobPayload } from "../../interfaces/applications/IApplicationService";
import { ICandidateApplicationService } from "../../interfaces/applications/IApplicationService";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { ALLOWED_APPLICATION_STATUSES } from "../../shared/constants/constants";
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
  //Apply job
  async applyJob(
    req: Request<{ candidateId: string; jobId: string }>,
    res: Response<{ message: string; data: ApplicationResponseDto }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { jobId, candidateId } = req.params;
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

export class CandidateApplicationsController
  implements ICandidateApplicationController
{
  constructor(private readonly _service: ICandidateApplicationService) {}
  //Get applications of candidate
  async getMyApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = (req.user as { id: string }).id;

      const {
        status,
        search,
        page = "1",
        limit = "10",
      } = req.query as IApplicationQueryParams;

      let pageNum = parseInt(page, 10);
      let limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
      if (isNaN(limitNum) || limitNum < 1) limitNum = 10;

      const filters: Parameters<
        ICandidateApplicationService["getApplicationsForCandidate"]
      >[1] = {
        page: pageNum,
        limit: limitNum,
      };

      if (search) filters.search = search;
      if (status && ALLOWED_APPLICATION_STATUSES.includes(status)) {
        filters.status = status;
      }

      const result = await this._service.getApplicationsForCandidate(
        candidateId,
        filters,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
        ...result,
      });
    } catch (err) {
      logger.error("Failed to fetch candidate applications", { error: err });
      next(err);
    }
  }
  //Fetch single application
  async getApplicationById(
    req: Request<{ applicationId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { applicationId } = req.params;
      const candidateId = (req.user as { id: string }).id;

      if (!applicationId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.VALIDATION_ERROR,
        );
      }

      const application = await this._service.getApplicationById(
        applicationId,
        candidateId,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
        data: application,
      });
    } catch (err) {
      logger.error("Failed to fetch application by ID", {
        applicationId: req.params.applicationId,
        error: err,
      });
      next(err);
    }
  }
}
