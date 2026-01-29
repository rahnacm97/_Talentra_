import { Request, Response } from "express";
import { AdminAnalyticsService } from "../../services/admin/admin.analytics.service";
export declare class AdminAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AdminAnalyticsService);
    getDashboardAnalytics: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=admin.analytics.controller.d.ts.map