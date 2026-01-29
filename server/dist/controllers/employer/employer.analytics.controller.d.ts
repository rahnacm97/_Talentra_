import { Request, Response } from "express";
import { EmployerAnalyticsService } from "../../services/employer/employer.analytics.service";
export declare class EmployerAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: EmployerAnalyticsService);
    getEmployerAnalytics: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=employer.analytics.controller.d.ts.map