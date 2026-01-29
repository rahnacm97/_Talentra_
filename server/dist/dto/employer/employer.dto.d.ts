export interface EmployerDataDTO {
    name: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    industry: string;
    companySize: string;
    founded: string;
    about: string;
    benefits: string[];
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
    cinNumber: string;
    businessLicense?: string;
    profileImage?: string;
}
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
export interface HiringStageDTO {
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
    hiringFunnel: HiringStageDTO[];
    timeToHire: TimeToHireDTO[];
}
//# sourceMappingURL=employer.dto.d.ts.map