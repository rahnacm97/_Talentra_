export interface EmployerStatsDTO {
    totalApplications: number;
    totalViews: number;
    activeJobs: number;
    avgTimeToHire: number;
    totalHired: number;
    conversionRate: number;
    offerAcceptanceRate: number;
    activePipeline: number;
}
export interface ApplicationOverTimeDTO {
    date: string;
    applications: number;
    views: number;
}
export interface ApplicationByStatusDTO {
    name: string;
    value: number;
    color: string;
}
export interface JobPerformanceDTO {
    job: string;
    jobId: string;
    applications: number;
    views: number;
    conversionRate: number;
}
export interface HiringFunnelStageDTO {
    stage: string;
    count: number;
    percentage: number;
}
export interface TimeToHireDTO {
    position: string;
    days: number;
}
export interface EmployerAnalyticsDTO {
    stats: EmployerStatsDTO;
    applicationsOverTime: ApplicationOverTimeDTO[];
    applicationsByStatus: ApplicationByStatusDTO[];
    jobPostingPerformance: JobPerformanceDTO[];
    hiringFunnel: HiringFunnelStageDTO[];
    timeToHire: TimeToHireDTO[];
}
//# sourceMappingURL=employer.analytics.dto.d.ts.map