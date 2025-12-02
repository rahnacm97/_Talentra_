import { NextFunction, Request, Response } from "express";

export interface IAdminAnalyticsController {
  getDashboardAnalytics(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
