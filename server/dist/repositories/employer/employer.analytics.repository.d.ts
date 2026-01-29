import { IEmployerAnalyticsRepository, IEmployerStats, IApplicationOverTime, IApplicationByStatus, IJobPerformance, IHiringFunnelStage, ITimeToHire } from "../../interfaces/employer/IEmployerAnalyticsRepository";
export declare class EmployerAnalyticsRepository implements IEmployerAnalyticsRepository {
    getEmployerStats(employerId: string): Promise<IEmployerStats>;
    getApplicationsOverTime(employerId: string, timeRange: string): Promise<IApplicationOverTime[]>;
    getApplicationsByStatus(employerId: string): Promise<IApplicationByStatus[]>;
    getJobPostingPerformance(employerId: string): Promise<IJobPerformance[]>;
    getHiringFunnel(employerId: string): Promise<IHiringFunnelStage[]>;
    getTimeToHire(employerId: string): Promise<ITimeToHire[]>;
}
//# sourceMappingURL=employer.analytics.repository.d.ts.map