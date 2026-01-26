import { EmployerAnalyticsDTO } from "../../../dto/employer/employer.analytics.dto";

export interface IEmployerAnalyticsService {
  getEmployerAnalytics(
    employerId: string,
    timeRange: string,
  ): Promise<EmployerAnalyticsDTO>;
}
