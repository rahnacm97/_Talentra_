import { Request, Response, NextFunction } from "express";
import { INotificationService } from "../../interfaces/notifications/INotificationService";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { INotificationController } from "../../interfaces/notifications/INOtificationContrller";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/enums/enums";

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
    const role = (req.user as { role: string } | undefined)?.role;
    return role || "";
  }
  //Fetch notification
  async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const userRole = this.getUserRole(req);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const isRead =
        req.query.isRead === "true"
          ? true
          : req.query.isRead === "false"
            ? false
            : undefined;

      const result = await this._service.getNotifications(userId, userRole, {
        page,
        limit,
        ...(isRead !== undefined && { isRead }),
      });

      res.json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err: unknown) {
      next(err);
    }
  }

  async getStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const userRole = this.getUserRole(req);
      const stats = await this._service.getStats(userId, userRole);

      res.json({
        success: true,
        data: stats,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
  //Marking read
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

      res.json({
        success: true,
        data: notification,
        message: SUCCESS_MESSAGES.NOTIFICATION_READ,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
  //Marking all read
  async markAllAsRead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = this.getUserId(req);
      await this._service.markAllAsRead(userId);

      res.json({
        success: true,
        message: SUCCESS_MESSAGES.ALL_READ,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
  //Deleting notification
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

      res.json({
        success: true,
        message: SUCCESS_MESSAGES.NOTIFICATION_DELETED,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
}
