import {
  IEmployerMapper,
  IEmployerAnalyticsMapper,
} from "../../interfaces/users/employer/IEmployerMapper";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import {
  EmployerDataDTO,
  EmployerAnalyticsDTO,
  EmployerStatsDTO,
  ApplicationOverTimeDTO,
  ApplicationByStatusDTO,
  JobPerformanceDTO,
  HiringStageDTO,
  TimeToHireDTO,
} from "../../dto/employer/employer.dto";
import {
  IEmployerStats,
  IApplicationOverTime,
  IApplicationByStatus,
  IJobPerformance,
  IHiringStage,
  ITimeToHire,
} from "../../interfaces/users/employer/IAnalyticsTypes";

export class EmployerMapper implements IEmployerMapper {
  toProfileDataDTO(employer: IEmployer): EmployerDataDTO {
    return {
      name: employer.name || "",
      email: employer.email || "",
      phone: employer.phoneNumber || "",
      location: employer.location || "",
      website: employer.website || "",
      industry: employer.industry || "",
      companySize: employer.companySize || "",
      founded: employer.founded || "",
      about: employer.about || "",
      benefits: employer.benefits || [],
      socialLinks: employer.socialLinks || {
        linkedin: "",
        twitter: "",
        facebook: "",
      },
      cinNumber: employer.cinNumber || "",
      businessLicense: employer.businessLicense || "",
      profileImage: employer.profileImage || "",
    };
  }
}

export class EmployerAnalyticsMapper implements IEmployerAnalyticsMapper {
  toEmployerStatsDTO(stats: IEmployerStats): EmployerStatsDTO {
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

  toApplicationOverTimeDTO(data: IApplicationOverTime): ApplicationOverTimeDTO {
    return {
      date: data.date,
      applications: data.applications,
      views: data.views,
    };
  }

  toApplicationByStatusDTO(data: IApplicationByStatus): ApplicationByStatusDTO {
    return {
      name: data.name,
      value: data.value,
      color: data.color,
    };
  }

  toJobPerformanceDTO(data: IJobPerformance): JobPerformanceDTO {
    return {
      job: data.job,
      jobId: data.jobId,
      applications: data.applications,
      views: data.views,
      conversionRate: data.conversionRate,
    };
  }

  toHiringStageDTO(data: IHiringStage): HiringStageDTO {
    return {
      stage: data.stage,
      count: data.count,
      percentage: data.percentage,
    };
  }

  toTimeToHireDTO(data: ITimeToHire): TimeToHireDTO {
    return {
      position: data.position,
      days: data.days,
    };
  }

  toEmployerAnalyticsDTO(
    stats: IEmployerStats,
    applicationsOverTime: IApplicationOverTime[],
    applicationsByStatus: IApplicationByStatus[],
    jobPostingPerformance: IJobPerformance[],
    hiringFunnel: IHiringStage[],
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
      hiringFunnel: hiringFunnel.map((item) => this.toHiringStageDTO(item)),
      timeToHire: timeToHire.map((item) => this.toTimeToHireDTO(item)),
    };
  }
}
