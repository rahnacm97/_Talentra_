import { IAdminAnalyticsRepository } from "../../interfaces/admin/IAdminAnalyticsRepository";
import { AdminAnalyticsRepository } from "../../repositories/admin/admin.analytics.repository";
import { AdminAnalyticsMapper } from "../../mappers/admin/admin.analytics.mapper";
import { AdminAnalyticsDTO } from "../../dto/admin/admin.analytics.dto";

export class AdminAnalyticsService {
  private repository: IAdminAnalyticsRepository;

  constructor(repository: AdminAnalyticsRepository) {
    this.repository = repository;
  }

  async getDashboardAnalytics(): Promise<AdminAnalyticsDTO> {
    const [stats, topJobs] = await Promise.all([
      this.repository.getDashboardStats(),
      this.repository.getTopPerformingJobs(5),
    ]);

    return AdminAnalyticsMapper.toAdminAnalyticsDTO(stats, topJobs);
  }
}
