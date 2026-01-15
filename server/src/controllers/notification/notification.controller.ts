import { Request, Response, NextFunction } from "express";
import { INotificationService } from "../../interfaces/notifications/INotificationService";
import { INotificationController } from "../../interfaces/notifications/INotificationContrller";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { ApiError } from "../../shared/utils/ApiError";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../shared/enums/enums";

export class NotificationController implements INotificationController {
  constructor(private readonly _service: INotificationService) {}

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

  private getUserRole(req: Request): string {
    return (req.user as { role: string } | undefined)?.role || "";
  }

  // Fetch notifications
  async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const userRole = this.getUserRole(req);

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const isRead =
        req.query.isRead === "true"
          ? true
          : req.query.isRead === "false"
            ? false
            : undefined;

      const filters = {
        page,
        limit,
        ...(isRead !== undefined && { isRead }),
      };

      const result = await this._service.getNotifications(
        userId,
        userRole,
        filters,
      );

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.NOTIFICATIONS_FETCHED,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch notifications", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Get notification stats
  async getStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const userRole = this.getUserRole(req);

      const stats = await this._service.getStats(userId, userRole);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.NOTIFICATION_STATS_FETCHED,
        data: stats,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to fetch notification stats", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Mark notification as read
  async markAsRead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.NOTIFICATION_ID_REQUIRED,
        );
      }

      const notification = await this._service.markAsRead(id, userId);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.NOTIFICATION_READ,
        data: notification,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to mark notification as read", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        notificationId: req.params.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Mark all notifications as read
  async markAllAsRead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);

      await this._service.markAllAsRead(userId);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ALL_READ,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to mark all notifications as read", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }

  // Delete notification
  async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.NOTIFICATION_ID_REQUIRED,
        );
      }

      await this._service.deleteNotification(id, userId);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.NOTIFICATION_DELETED,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SERVER_ERROR;

      logger.error("Failed to delete notification", {
        error: message,
        userId: (req.user as { id: string } | undefined)?.id,
        notificationId: req.params.id,
      });

      next(
        err instanceof ApiError
          ? err
          : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),
      );
    }
  }
}
