import { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { IEmployerAnalyticsController } from "../../interfaces/users/employer/IEmployerController";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { IEmployerAnalyticsService } from "../../interfaces/users/employer/IEmployerService";
import { AuthenticatedRequest } from "../../middlewares/subscriptionCheck";

export class EmployerAnalyticsController
  implements IEmployerAnalyticsController
{
  constructor(private readonly _analyticsService: IEmployerAnalyticsService) {}

  getEmployerAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employerId = (req as AuthenticatedRequest).user?.id;

      if (!employerId) {
        logger.warn("Unauthorized access attempt to employer analytics", {
          ip: req.ip,
          path: req.path,
        });
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
      }

      const timeRange = (req.query.timeRange as string) || "30d";

      logger.info("Employer requested analytics dashboard", {
        employerId,
        timeRange,
      });

      const analytics = await this._analyticsService.getEmployerAnalytics(
        employerId,
        timeRange,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FETCH_SUCCESS,
        data: analytics,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch employer analytics", {
        error: message,
        timeRange: req.query.timeRange,
        path: req.path,
      });

      next(
        error instanceof ApiError
          ? error
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  };
}
