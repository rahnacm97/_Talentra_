import {
  IEmployerStats,
  IApplicationOverTime,
  IApplicationByStatus,
  IJobPerformance,
  IHiringFunnelStage,
  ITimeToHire,
} from "../../interfaces/employer/IEmployerAnalyticsRepository";
import {
  EmployerAnalyticsDTO,
  EmployerStatsDTO,
  ApplicationOverTimeDTO,
  ApplicationByStatusDTO,
  JobPerformanceDTO,
  HiringFunnelStageDTO,
  TimeToHireDTO,
} from "../../dto/employer/employer.analytics.dto";

export class EmployerAnalyticsMapper {
  static toEmployerStatsDTO(stats: IEmployerStats): EmployerStatsDTO {
    return {
      totalApplications: stats.totalApplications,
      totalViews: stats.totalViews,
      activeJobs: stats.activeJobs,
      avgTimeToHire: stats.avgTimeToHire,
      totalHired: stats.totalHired,
      conversionRate: stats.conversionRate,
      offerAcceptanceRate: stats.offerAcceptanceRate,
      activePipeline: stats.activePipeline,
    };
  }

  static toApplicationOverTimeDTO(
    data: IApplicationOverTime,
  ): ApplicationOverTimeDTO {
    return {
      date: data.date,
      applications: data.applications,
      views: data.views,
    };
  }

  static toApplicationByStatusDTO(
    data: IApplicationByStatus,
  ): ApplicationByStatusDTO {
    return {
      name: data.name,
      value: data.value,
      color: data.color,
    };
  }

  static toJobPerformanceDTO(data: IJobPerformance): JobPerformanceDTO {
    return {
      job: data.job,
      jobId: data.jobId,
      applications: data.applications,
      views: data.views,
      conversionRate: data.conversionRate,
    };
  }

  static toHiringFunnelStageDTO(data: IHiringFunnelStage): HiringFunnelStageDTO {
    return {
      stage: data.stage,
      count: data.count,
      percentage: data.percentage,
    };
  }

  static toTimeToHireDTO(data: ITimeToHire): TimeToHireDTO {
    return {
      position: data.position,
      days: data.days,
    };
  }

  static toEmployerAnalyticsDTO(
    stats: IEmployerStats,
    applicationsOverTime: IApplicationOverTime[],
    applicationsByStatus: IApplicationByStatus[],
    jobPostingPerformance: IJobPerformance[],
    hiringFunnel: IHiringFunnelStage[],
    timeToHire: ITimeToHire[],
  ): EmployerAnalyticsDTO {
    return {
      stats: this.toEmployerStatsDTO(stats),
      applicationsOverTime: applicationsOverTime.map((item) =>
        this.toApplicationOverTimeDTO(item),
      ),
      applicationsByStatus: applicationsByStatus.map((item) =>
        this.toApplicationByStatusDTO(item),
      ),
      jobPostingPerformance: jobPostingPerformance.map((item) =>
        this.toJobPerformanceDTO(item),
      ),
      hiringFunnel: hiringFunnel.map((item) =>
        this.toHiringFunnelStageDTO(item),
      ),
      timeToHire: timeToHire.map((item) => this.toTimeToHireDTO(item)),
    };
  }
}
