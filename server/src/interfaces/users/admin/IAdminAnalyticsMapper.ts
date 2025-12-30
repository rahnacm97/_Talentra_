import {
  IDashboardStats,
  ITopPerformingJob,
  IRecentSubscription,
  IPlatformGrowth,
  IUserDistribution,
  IApplicationStatusDistribution,
  ITopJobCategory,
  ISubscriptionRevenue,
} from "../../../interfaces/users/admin/IAdminAnalyticsRepository";
import {
  AdminAnalyticsDTO,
  DashboardStatsDTO,
  TopPerformingJobDTO,
} from "../../../dto/admin/admin.analytics.dto";

export interface IAdminAnalyticsMapper {
  toDashboardStatsDTO(stats: IDashboardStats): DashboardStatsDTO;
  toTopPerformingJobDTO(job: ITopPerformingJob): TopPerformingJobDTO;
  toAdminAnalyticsDTO(
    stats: IDashboardStats,
    topJobs: ITopPerformingJob[],
    subscriptions: IRecentSubscription[],
    platformGrowth: IPlatformGrowth[],
    userDistribution: IUserDistribution[],
    applicationStatusDistribution: IApplicationStatusDistribution[],
    topJobCategories: ITopJobCategory[],
    subscriptionRevenue: ISubscriptionRevenue[],
  ): AdminAnalyticsDTO;
}
