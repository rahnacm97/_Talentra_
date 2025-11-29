import { Request, Response } from "express";
import { EmployerAnalyticsService } from "../../services/employer/employer.analytics.service";

export class EmployerAnalyticsController {
  constructor(private readonly analyticsService: EmployerAnalyticsService) {}

  getEmployerAnalytics = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const employerId = (req as any).user?._id;
      const timeRange = (req.query.timeRange as string) || "30days";

      if (!employerId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const analytics =
        await this.analyticsService.getEmployerAnalytics(
          employerId,
          timeRange,
        );

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error in getEmployerAnalytics controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch employer analytics",
      });
    }
  };
}
