import { Request, Response, NextFunction } from "express";
import { IInterviewFeedbackController } from "../../interfaces/interviews/IInterviewController";
import { IInterviewFeedbackService } from "../../interfaces/interviews/IInterviewService";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";

export class InterviewFeedbackController
  implements IInterviewFeedbackController
{
  constructor(private readonly _service: IInterviewFeedbackService) {}

  async submitFeedback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roundId } = req.params;
      const providedBy = (req.user as { id: string }).id;
      const feedbackData = req.body;

      if (!roundId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      if (!feedbackData.rating || !feedbackData.recommendation) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.RATING_REQUIRED,
        );
      }

      const feedback = await this._service.submitFeedback(roundId as string, {
        ...feedbackData,
        providedBy,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.FEEDBACK_SUBMITTED,
        feedback,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.FEEDBACK_SUBMISSION_ERROR;
      logger.error("Failed to submit feedback", {
        error: message,
        roundId: req.params.roundId,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getFeedbackForRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roundId } = req.params;

      if (!roundId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      const feedback = await this._service.getFeedbackForRound(
        roundId as string,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.FEEDBACK_FETCHED,
        feedback,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.FAILED_FETCH_FEEDBACK;
      logger.error("Failed to fetch round feedback", {
        error: message,
        roundId: req.params.roundId,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getSharedFeedbackForRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roundId } = req.params;

      if (!roundId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      const feedback = await this._service.getSharedFeedbackForRound(
        roundId as string,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SHARED_FEEDBACK,
        feedback,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.FAILED_FETCH_FEEDBACK;
      logger.error("Failed to fetch shared round feedback", {
        error: message,
        roundId: req.params.roundId,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getFeedbackForApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { applicationId } = req.params;

      if (!applicationId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.APPLICATION_ID_REQUIRED,
        );
      }

      const feedback = await this._service.getFeedbackForApplication(
        applicationId as string,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.FEEDBACK_FETCHED,
        feedback,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.FAILED_FETCH_FEEDBACK;
      logger.error("Failed to fetch application feedback", {
        error: message,
        applicationId: req.params.applicationId,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getFeedbackSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roundId } = req.params;

      if (!roundId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      const summary = await this._service.getFeedbackSummary(roundId as string);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUMMARY_FEEDBACK,
        summary,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SUMMARY_FETCH;
      logger.error("Failed to fetch feedback summary", {
        error: message,
        roundId: req.params.roundId,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async shareFeedbackWithCandidate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.REQUIRED_ID);
      }

      const feedback = await this._service.shareFeedbackWithCandidate(
        id as string,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.CANDIDATE_FEEDBACK,
        feedback,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.FEEDBACK_SHARE;
      logger.error("Failed to share feedback", {
        error: message,
        feedbackId: req.params.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
