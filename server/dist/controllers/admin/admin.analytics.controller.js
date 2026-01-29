"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsController = void 0;
class AdminAnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
        this.getDashboardAnalytics = async (req, res) => {
            try {
                const analytics = await this.analyticsService.getDashboardAnalytics();
                res.status(200).json({
                    success: true,
                    data: analytics,
                });
            }
            catch (error) {
                console.error("Error in getDashboardAnalytics controller:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch dashboard analytics",
                });
            }
        };
    }
}
exports.AdminAnalyticsController = AdminAnalyticsController;
//# sourceMappingURL=admin.analytics.controller.js.map