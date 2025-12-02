import { IEmployer } from "./IEmployer";
import {
  EmployerDataDTO,
  EmployerAnalyticsDTO,
  EmployerStatsDTO,
  ApplicationOverTimeDTO,
  ApplicationByStatusDTO,
  JobPerformanceDTO,
  HiringStageDTO,
  TimeToHireDTO,
} from "../../../dto/employer/employer.dto";
import {
  IEmployerStats,
  IApplicationOverTime,
  IApplicationByStatus,
  IJobPerformance,
  IHiringStage,
  ITimeToHire,
} from "./IAnalyticsTypes";

export interface IEmployerMapper {
  toProfileDataDTO(employer: IEmployer): EmployerDataDTO;
}

export interface IEmployerAnalyticsMapper {
  toEmployerStatsDTO(stats: IEmployerStats): EmployerStatsDTO;

  toApplicationOverTimeDTO(data: IApplicationOverTime): ApplicationOverTimeDTO;

  toApplicationByStatusDTO(data: IApplicationByStatus): ApplicationByStatusDTO;

  toJobPerformanceDTO(data: IJobPerformance): JobPerformanceDTO;

  toHiringStageDTO(data: IHiringStage): HiringStageDTO;

  toTimeToHireDTO(data: ITimeToHire): TimeToHireDTO;

  toEmployerAnalyticsDTO(
    stats: IEmployerStats,
    applicationsOverTime: IApplicationOverTime[],
    applicationsByStatus: IApplicationByStatus[],
    jobPostingPerformance: IJobPerformance[],
    hiringFunnel: IHiringStage[],
    timeToHire: ITimeToHire[],
  ): EmployerAnalyticsDTO;
}
