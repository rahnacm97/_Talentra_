import { IEmployerMapper, IEmployerAnalyticsMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { EmployerDataDTO, EmployerAnalyticsDTO, EmployerStatsDTO, ApplicationOverTimeDTO, ApplicationByStatusDTO, JobPerformanceDTO, HiringStageDTO, TimeToHireDTO } from "../../dto/employer/employer.dto";
import { IEmployerStats, IApplicationOverTime, IApplicationByStatus, IJobPerformance, IHiringStage, ITimeToHire } from "../../interfaces/users/employer/IAnalyticsTypes";
export declare class EmployerMapper implements IEmployerMapper {
    toProfileDataDTO(employer: IEmployer): EmployerDataDTO;
}
export declare class EmployerAnalyticsMapper implements IEmployerAnalyticsMapper {
    toEmployerStatsDTO(stats: IEmployerStats): EmployerStatsDTO;
    toApplicationOverTimeDTO(data: IApplicationOverTime): ApplicationOverTimeDTO;
    toApplicationByStatusDTO(data: IApplicationByStatus): ApplicationByStatusDTO;
    toJobPerformanceDTO(data: IJobPerformance): JobPerformanceDTO;
    toHiringStageDTO(data: IHiringStage): HiringStageDTO;
    toTimeToHireDTO(data: ITimeToHire): TimeToHireDTO;
    toEmployerAnalyticsDTO(stats: IEmployerStats, applicationsOverTime: IApplicationOverTime[], applicationsByStatus: IApplicationByStatus[], jobPostingPerformance: IJobPerformance[], hiringFunnel: IHiringStage[], timeToHire: ITimeToHire[]): EmployerAnalyticsDTO;
}
//# sourceMappingURL=employer.mapper.d.ts.map