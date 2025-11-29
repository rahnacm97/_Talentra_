import { Request, Response } from "express";
import { AdminAnalyticsService } from "../../services/admin/admin.analytics.service";

export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  getDashboardAnalytics = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const analytics = await this.analyticsService.getDashboardAnalytics();

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error in getDashboardAnalytics controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard analytics",
      });
    }
  };
}
