import { IEmployerStats, IApplicationOverTime, IApplicationByStatus, IJobPerformance, IHiringFunnelStage, ITimeToHire } from "../../interfaces/employer/IEmployerAnalyticsRepository";
import { EmployerAnalyticsDTO, EmployerStatsDTO, ApplicationOverTimeDTO, ApplicationByStatusDTO, JobPerformanceDTO, HiringFunnelStageDTO, TimeToHireDTO } from "../../dto/employer/employer.analytics.dto";
export declare class EmployerAnalyticsMapper {
    static toEmployerStatsDTO(stats: IEmployerStats): EmployerStatsDTO;
    static toApplicationOverTimeDTO(data: IApplicationOverTime): ApplicationOverTimeDTO;
    static toApplicationByStatusDTO(data: IApplicationByStatus): ApplicationByStatusDTO;
    static toJobPerformanceDTO(data: IJobPerformance): JobPerformanceDTO;
    static toHiringFunnelStageDTO(data: IHiringFunnelStage): HiringFunnelStageDTO;
    static toTimeToHireDTO(data: ITimeToHire): TimeToHireDTO;
    static toEmployerAnalyticsDTO(stats: IEmployerStats, applicationsOverTime: IApplicationOverTime[], applicationsByStatus: IApplicationByStatus[], jobPostingPerformance: IJobPerformance[], hiringFunnel: IHiringFunnelStage[], timeToHire: ITimeToHire[]): EmployerAnalyticsDTO;
}
//# sourceMappingURL=employer.analytics.mapper.d.ts.map