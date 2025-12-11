import {
  IDashboardStats,
  ITopPerformingJob,
  IRecentSubscription,
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
  ): AdminAnalyticsDTO;
}
