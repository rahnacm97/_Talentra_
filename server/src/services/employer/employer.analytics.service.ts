import { IEmployerAnalyticsRepository } from "../../interfaces/employer/IEmployerAnalyticsRepository";
import { EmployerAnalyticsRepository } from "../../repositories/employer/employer.analytics.repository";
import { EmployerAnalyticsMapper } from "../../mappers/employer/employer.analytics.mapper";
import { EmployerAnalyticsDTO } from "../../dto/employer/employer.analytics.dto";

export class EmployerAnalyticsService {
  private repository: IEmployerAnalyticsRepository;

  constructor(repository: EmployerAnalyticsRepository) {
    this.repository = repository;
  }

  async getEmployerAnalytics(
    employerId: string,
    timeRange: string,
  ): Promise<EmployerAnalyticsDTO> {
    const [
      stats,
      applicationsOverTime,
      applicationsByStatus,
      jobPostingPerformance,
      hiringFunnel,
      timeToHire,
    ] = await Promise.all([
      this.repository.getEmployerStats(employerId),
      this.repository.getApplicationsOverTime(employerId, timeRange),
      this.repository.getApplicationsByStatus(employerId),
      this.repository.getJobPostingPerformance(employerId),
      this.repository.getHiringFunnel(employerId),
      this.repository.getTimeToHire(employerId),
    ]);

    return EmployerAnalyticsMapper.toEmployerAnalyticsDTO(
      stats,
      applicationsOverTime,
      applicationsByStatus,
      jobPostingPerformance,
      hiringFunnel,
      timeToHire,
    );
  }
}
