import { NextFunction, Request, Response } from "express";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import { IVideoCallController } from "../../interfaces/videoCall/IVideoCallController";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";

export class VideoCallController implements IVideoCallController {
  constructor(private readonly _videoCallService: IVideoCallService) {}

  private getUserId(req: Request): string {
    const userId = (req.user as { id: string } | undefined)?.id;
    if (!userId) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTHENTICATION,
      );
    }
    return userId;
  }

  // Initiating video call
  async initiateCall(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { interviewId, participants } = req.body;

      if (
        !interviewId ||
        !participants ||
        !Array.isArray(participants) ||
        participants.length === 0
      ) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "interviewId and a non-empty participants array are required",
        );
      }

      const call = await this._videoCallService.initiateCall(
        interviewId,
        participants,
      );

      logger.info("Video call initiated successfully", { interviewId, userId });

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.VIDEO_CALL_INITIATED,
        data: call,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to initiate video call", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        body: req.body,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Ending video call
  async endCall(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { interviewId } = req.body;

      if (!interviewId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "interviewId is required");
      }

      const result = await this._videoCallService.endCall(interviewId);

      logger.info("Video call ended successfully", { interviewId, userId });

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.VIDEO_CALL_ENDED,
        data: result,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to end video call", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        interviewId: req.body.interviewId,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Fetching call status
  async getCallStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { interviewId } = req.params;

      if (!interviewId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Interview ID is required");
      }

      const call = await this._videoCallService.getCallStatus(interviewId);

      if (!call) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          "No active call found for this interview",
        );
      }

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.VIDEO_CALL_STATUS_FETCHED,
        data: call,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch call status", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        interviewId: req.params.interviewId,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
