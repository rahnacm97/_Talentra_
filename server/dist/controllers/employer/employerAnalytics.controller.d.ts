import { NextFunction, Request, Response } from "express";
import { IEmployerAnalyticsController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerAnalyticsService } from "../../interfaces/users/employer/IEmployerService";
export declare class EmployerAnalyticsController implements IEmployerAnalyticsController {
    private readonly _analyticsService;
    constructor(_analyticsService: IEmployerAnalyticsService);
    getEmployerAnalytics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=employerAnalytics.controller.d.ts.map