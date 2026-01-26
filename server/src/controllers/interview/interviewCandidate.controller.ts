import { Request, Response, NextFunction } from "express";
import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { ICandidateInterviewController } from "../../interfaces/interviews/IInterviewController";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import {
  IInterviewQuery,
  InterviewStatus,
} from "../../interfaces/interviews/IInterview";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { ApiError } from "../../shared/utils/ApiError";

export class CandidateInterviewController
  implements ICandidateInterviewController
{
  constructor(private readonly _service: IInterviewService) {}
  //Fetch candidate interviews
  async getMyInterviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = req.user!.id;
      const { page, limit, search, status } = req.query;

      const filters: IInterviewQuery = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
        search: search as string,
        ...(status && { status: status as InterviewStatus | "all" }),
      };

      const result = await this._service.getInterviewsForCandidate(
        candidateId,
        filters,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.INTERVIEWS_FETCHED,
        ...result,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;
      logger.error("Failed to fetch candidate interviews", {
        error: message,
        candidateId: req.user?.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
