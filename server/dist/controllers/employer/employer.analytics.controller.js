"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerAnalyticsController = void 0;
class EmployerAnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
        this.getEmployerAnalytics = async (req, res) => {
            try {
                const employerId = req.user?._id;
                const timeRange = req.query.timeRange || "30days";
                if (!employerId) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized",
                    });
                    return;
                }
                const analytics = await this.analyticsService.getEmployerAnalytics(employerId, timeRange);
                res.status(200).json({
                    success: true,
                    data: analytics,
                });
            }
            catch (error) {
                console.error("Error in getEmployerAnalytics controller:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch employer analytics",
                });
            }
        };
    }
}
exports.EmployerAnalyticsController = EmployerAnalyticsController;
//# sourceMappingURL=employer.analytics.controller.js.map