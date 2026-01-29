"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsService = void 0;
const admin_analytics_mapper_1 = require("../../mappers/admin/admin.analytics.mapper");
class AdminAnalyticsService {
    constructor(repository) {
        this.repository = repository;
    }
    async getDashboardAnalytics() {
        const [stats, topJobs] = await Promise.all([
            this.repository.getDashboardStats(),
            this.repository.getTopPerformingJobs(5),
        ]);
        return admin_analytics_mapper_1.AdminAnalyticsMapper.toAdminAnalyticsDTO(stats, topJobs);
    }
}
exports.AdminAnalyticsService = AdminAnalyticsService;
//# sourceMappingURL=admin.analytics.service.js.map