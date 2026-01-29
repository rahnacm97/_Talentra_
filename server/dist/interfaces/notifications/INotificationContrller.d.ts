import { Request, Response, NextFunction } from "express";
export interface INotificationController {
    getNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=INotificationContrller.d.ts.map