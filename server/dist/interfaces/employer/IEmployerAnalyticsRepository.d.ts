export interface IEmployerStats {
    totalApplications: number;
    totalViews: number;
    activeJobs: number;
    avgTimeToHire: number;
    totalHired: number;
    conversionRate: number;
    offerAcceptanceRate: number;
    activePipeline: number;
}
export interface IApplicationOverTime {
    date: string;
    applications: number;
    views: number;
}
export interface IApplicationByStatus {
    name: string;
    value: number;
    color: string;
}
export interface IJobPerformance {
    job: string;
    jobId: string;
    applications: number;
    views: number;
    conversionRate: number;
}
export interface IHiringFunnelStage {
    stage: string;
    count: number;
    percentage: number;
}
export interface ITimeToHire {
    position: string;
    days: number;
}
export interface IEmployerAnalyticsRepository {
    getEmployerStats(employerId: string): Promise<IEmployerStats>;
    getApplicationsOverTime(employerId: string, timeRange: string): Promise<IApplicationOverTime[]>;
    getApplicationsByStatus(employerId: string): Promise<IApplicationByStatus[]>;
    getJobPostingPerformance(employerId: string): Promise<IJobPerformance[]>;
    getHiringFunnel(employerId: string): Promise<IHiringFunnelStage[]>;
    getTimeToHire(employerId: string): Promise<ITimeToHire[]>;
}
//# sourceMappingURL=IEmployerAnalyticsRepository.d.ts.map