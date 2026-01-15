import { NextFunction, Request, Response } from "express";
import { IAIController } from "../../interfaces/ai/IAIController";
import { IAIService } from "../../interfaces/ai/IAIService";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";

export class AIController implements IAIController {
  constructor(
    private _aiService: IAIService,
    private _candidateService: ICandidateService,
    private _jobService: ICandidateJobService,
  ) {}

  async getMatchScore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { candidateId, jobId } = req.body;

      if (!candidateId || !jobId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Candidate ID and Job ID are required",
        );
      }

      const candidate =
        await this._candidateService.getCandidateById(candidateId);
      if (!candidate) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Candidate not found");
      }

      const job = await this._jobService.getJobById(jobId, candidateId);
      if (!job) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.JOB_NOT_FOUND);
      }

      const result = await this._aiService.calculateMatchScore(
        candidate,
        job.description,
        job.title,
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      logger.error("Error in getMatchScore", { error });
      next(error);
    }
  }

  async summarizeCandidate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { candidateId } = req.body;

      if (!candidateId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Candidate ID is required");
      }

      const candidate =
        await this._candidateService.getCandidateById(candidateId);
      if (!candidate) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Candidate not found");
      }

      const summary = await this._aiService.generateCandidateSummary(candidate);
      res.status(HTTP_STATUS.OK).json({ summary });
    } catch (error) {
      logger.error("Error in summarizeCandidate", { error });
      next(error);
    }
  }
}
