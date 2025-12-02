import { NextFunction, Request, Response } from "express";
import { IAdminAnalyticsService } from "../../interfaces/users/admin/IAdminAnalyticsService";
import { IAdminAnalyticsController } from "../../interfaces/users/admin/IAdminAnalyticsController";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";

export class AdminAnalyticsController implements IAdminAnalyticsController {
  constructor(private readonly _analyticsService: IAdminAnalyticsService) {}
  //Fetching dashboard informations
  getDashboardAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.info("Admin requested dashboard analytics");

      const analytics = await this._analyticsService.getDashboardAnalytics();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FETCH_SUCCESS,
        data: analytics,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch dashboard analytics", {
        error: message,
      });

      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}
