import { Request, Response, NextFunction } from "express";
import { IInterviewRoundController } from "../../interfaces/interviews/IInterviewController";
import { IInterviewRoundService } from "../../interfaces/interviews/IInterviewService";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";
import {
  IInterviewRoundQuery,
  InterviewRoundStatus,
} from "../../interfaces/interviews/IInterview";

export class InterviewRoundController implements IInterviewRoundController {
  constructor(private readonly _service: IInterviewRoundService) {}

  async createRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const employerId = req.user!.id;
      const roundData = req.body;

      if (!roundData.applicationId || !roundData.roundNumber) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.APPLICATION_ID_ROUND_REQUIRED,
        );
      }

      const round = await this._service.createRound(roundData.applicationId, {
        ...roundData,
        employerId,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.ROUND_CREATED,
        round,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_CREATION;
      logger.error("Failed to create interview round", {
        error: message,
        employerId: (req.user as { id: string } | undefined)?.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getRoundById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      const round = await this._service.getRoundById(id as string);

      if (!round) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.ROUND_NOT_FOUND,
        );
      }

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_FETCH,
        round,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_FETCH;
      logger.error("Failed to fetch interview round", {
        error: message,
        roundId: req.params.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getRoundsForApplication(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { status } = req.query;

      if (!applicationId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.APPLICATION_ID_REQUIRED,
        );
      }

      const query: IInterviewRoundQuery = {
        ...(status && { status: status as InterviewRoundStatus }),
      };

      const rounds = await this._service.getRoundsForApplication(
        applicationId as string,
        query,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_FETCH,
        rounds,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_FETCH;
      logger.error("Failed to fetch application rounds", {
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

  async getMyRounds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const candidateId = req.user!.id;
      const { page, limit, search, status } = req.query;

      const query: IInterviewRoundQuery = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
        search: search as string,
        ...(status && { status: status as InterviewRoundStatus }),
      };

      const result = await this._service.getRoundsForCandidate(
        candidateId,
        query,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_FETCH,
        ...result,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_FETCH;
      logger.error("Failed to fetch candidate rounds", {
        error: message,
        candidateId: (req.user as { id: string } | undefined)?.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async getEmployerRounds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const employerId = req.user!.id;
      const { page, limit, search, status } = req.query;

      const query: IInterviewRoundQuery = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
        search: search as string,
        ...(status && { status: status as InterviewRoundStatus }),
      };

      const result = await this._service.getRoundsForEmployer(
        employerId,
        query,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_FETCH,
        ...result,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_FETCH;
      logger.error("Failed to fetch employer rounds", {
        error: message,
        employerId: (req.user as { id: string } | undefined)?.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async updateRoundStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      if (!status) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.STATUS_REQUIRED,
        );
      }

      const round = await this._service.updateRoundStatus(id as string, status);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_STATUS,
        round,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_STATUS;
      logger.error("Failed to update round status", {
        error: message,
        roundId: req.params.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async rescheduleRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { newDate } = req.body;

      if (!id) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      if (!newDate) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.DATE_REQUIRED,
        );
      }

      const round = await this._service.rescheduleRound(id as string, newDate);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_RESCHEDULE,
        round,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_RESCHEDULE;
      logger.error("Failed to reschedule round", {
        error: message,
        roundId: req.params.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async cancelRound(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!id) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_REQUIRED,
        );
      }

      const round = await this._service.cancelRound(id as string, reason);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ROUND_CANCEL,
        round,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.ROUND_CANCEL;
      logger.error("Failed to cancel round", {
        error: message,
        roundId: req.params.id,
      });
      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  async validateMeetingAccess(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roundId, token } = req.params;

      if (!roundId || !token) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.ROUND_ID_TOKEN_REQUIRED,
        );
      }

      const result = await this._service.validateMeetingAccess(
        roundId as string,
        token as string,
      );

      if (!result.valid) {
        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          ERROR_MESSAGES.INVALID_MEETLINK,
        );
      }

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.VALIDATE_ACCESS,
        round: result.round,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.VALIDATE_ACCESS;
      logger.error("Failed to validate meeting access", {
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
}
