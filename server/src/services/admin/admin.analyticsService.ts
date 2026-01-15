import { IAdminAnalyticsRepository } from "../../interfaces/users/admin/IAdminAnalyticsRepository";
import { AdminAnalyticsDTO } from "../../dto/admin/admin.analytics.dto";
import { IAdminAnalyticsService } from "../../interfaces/users/admin/IAdminAnalyticsService";
import { IAdminAnalyticsMapper } from "../../interfaces/users/admin/IAdminAnalyticsMapper";

export class AdminAnalyticsService implements IAdminAnalyticsService {
  constructor(
    private _repository: IAdminAnalyticsRepository,
    private _mapper: IAdminAnalyticsMapper,
  ) {}

  //Fetching dashboard informations
  async getDashboardAnalytics(
    timeRange: string = "30days",
  ): Promise<AdminAnalyticsDTO> {
    const [
      stats,
      topJobs,
      recentSubscriptions,
      platformGrowth,
      userDistribution,
      applicationStatusDistribution,
      topJobCategories,
      subscriptionRevenue,
    ] = await Promise.all([
      this._repository.getDashboardStats(),
      this._repository.getTopPerformingJobs(5),
      this._repository.getRecentSubscriptions(5),
      this._repository.getPlatformGrowthOverTime(timeRange),
      this._repository.getUserDistribution(),
      this._repository.getApplicationStatusDistribution(),
      this._repository.getTopJobCategories(5),
      this._repository.getSubscriptionRevenueTrends(timeRange),
    ]);

    return this._mapper.toAdminAnalyticsDTO(
      stats,
      topJobs,
      recentSubscriptions,
      platformGrowth,
      userDistribution,
      applicationStatusDistribution,
      topJobCategories,
      subscriptionRevenue,
    );
  }
}
