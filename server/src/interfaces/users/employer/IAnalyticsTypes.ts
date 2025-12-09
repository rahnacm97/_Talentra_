export interface IApplicationsOverTimeResult {
  _id: string;
  applications: number;
}

export interface IApplicationsByStatusResult {
  _id: string;
  count: number;
}

export interface IJobPerformanceResult {
  job: string;
  jobId: string;
  applications: number;
  views: number;
  conversionRate: number;
}

export interface ITimeToHireResult {
  position: string;
  avgDays: number;
}

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

export interface IHiringStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ITimeToHire {
  position: string;
  days: number;
}
