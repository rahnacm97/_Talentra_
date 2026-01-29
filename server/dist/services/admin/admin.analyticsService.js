"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsService = void 0;
class AdminAnalyticsService {
    constructor(_repository, _mapper) {
        this._repository = _repository;
        this._mapper = _mapper;
    }
    //Fetching dashboard informations
    async getDashboardAnalytics(timeRange = "30days") {
        const [stats, topJobs, recentSubscriptions, platformGrowth, userDistribution, applicationStatusDistribution, topJobCategories, subscriptionRevenue,] = await Promise.all([
            this._repository.getDashboardStats(),
            this._repository.getTopPerformingJobs(5),
            this._repository.getRecentSubscriptions(5),
            this._repository.getPlatformGrowthOverTime(timeRange),
            this._repository.getUserDistribution(),
            this._repository.getApplicationStatusDistribution(),
            this._repository.getTopJobCategories(5),
            this._repository.getSubscriptionRevenueTrends(timeRange),
        ]);
        return this._mapper.toAdminAnalyticsDTO(stats, topJobs, recentSubscriptions, platformGrowth, userDistribution, applicationStatusDistribution, topJobCategories, subscriptionRevenue);
    }
}
exports.AdminAnalyticsService = AdminAnalyticsService;
//# sourceMappingURL=admin.analyticsService.js.map