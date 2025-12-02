import {
  IDashboardStats,
  ITopPerformingJob,
} from "../../interfaces/users/admin/IAdminAnalyticsRepository";
import {
  AdminAnalyticsDTO,
  DashboardStatsDTO,
  TopPerformingJobDTO,
} from "../../dto/admin/admin.analytics.dto";
import { IAdminAnalyticsMapper } from "../../interfaces/users/admin/IAdminAnalyticsMapper";

export class AdminAnalyticsMapper implements IAdminAnalyticsMapper {
  toDashboardStatsDTO(stats: IDashboardStats): DashboardStatsDTO {
    return {
      totalCandidates: stats.totalCandidates,
      totalEmployers: stats.totalEmployers,
      totalJobs: stats.totalJobs,
      totalApplications: stats.totalApplications,
      totalInterviews: stats.totalInterviews,
      activeCandidates: stats.activeCandidates,
      activeJobs: stats.activeJobs,
      pendingApplications: stats.pendingApplications,
    };
  }

  toTopPerformingJobDTO(job: ITopPerformingJob): TopPerformingJobDTO {
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      applications: job.applications,
      status: job.status,
    };
  }

  toAdminAnalyticsDTO(
    stats: IDashboardStats,
    topJobs: ITopPerformingJob[],
  ): AdminAnalyticsDTO {
    return {
      stats: this.toDashboardStatsDTO(stats),
      topJobs: topJobs.map((job) => this.toTopPerformingJobDTO(job)),
    };
  }
}
