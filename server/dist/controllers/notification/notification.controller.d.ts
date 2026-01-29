import { Request, Response, NextFunction } from "express";
import { INotificationService } from "../../interfaces/notifications/INotificationService";
import { INotificationController } from "../../interfaces/notifications/INotificationContrller";
export declare class NotificationController implements INotificationController {
    private readonly _service;
    constructor(_service: INotificationService);
    private getUserId;
    private getUserRole;
    getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map