import { IDashboardStats, ITopPerformingJob, IRecentSubscription, IPlatformGrowth, IUserDistribution, IApplicationStatusDistribution, ITopJobCategory, ISubscriptionRevenue } from "../../interfaces/users/admin/IAdminAnalyticsRepository";
import { AdminAnalyticsDTO, DashboardStatsDTO, TopPerformingJobDTO, RecentSubscriptionDTO } from "../../dto/admin/admin.analytics.dto";
import { IAdminAnalyticsMapper } from "../../interfaces/users/admin/IAdminAnalyticsMapper";
export declare class AdminAnalyticsMapper implements IAdminAnalyticsMapper {
    toDashboardStatsDTO(stats: IDashboardStats): DashboardStatsDTO;
    toTopPerformingJobDTO(job: ITopPerformingJob): TopPerformingJobDTO;
    toRecentSubscriptionDTO(sub: IRecentSubscription): RecentSubscriptionDTO;
    toAdminAnalyticsDTO(stats: IDashboardStats, topJobs: ITopPerformingJob[], recentSubscriptions: IRecentSubscription[], platformGrowth: IPlatformGrowth[], userDistribution: IUserDistribution[], applicationStatusDistribution: IApplicationStatusDistribution[], topJobCategories: ITopJobCategory[], subscriptionRevenue: ISubscriptionRevenue[]): AdminAnalyticsDTO;
}
//# sourceMappingURL=admin.analytics.mapper.d.ts.map