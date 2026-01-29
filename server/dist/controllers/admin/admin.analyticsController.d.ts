import { NextFunction, Request, Response } from "express";
import { IAdminAnalyticsService } from "../../interfaces/users/admin/IAdminAnalyticsService";
import { IAdminAnalyticsController } from "../../interfaces/users/admin/IAdminAnalyticsController";
export declare class AdminAnalyticsController implements IAdminAnalyticsController {
    private readonly _analyticsService;
    constructor(_analyticsService: IAdminAnalyticsService);
    getDashboardAnalytics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=admin.analyticsController.d.ts.map