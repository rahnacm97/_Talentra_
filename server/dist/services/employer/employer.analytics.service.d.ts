import { EmployerAnalyticsRepository } from "../../repositories/employer/employer.analytics.repository";
import { EmployerAnalyticsDTO } from "../../dto/employer/employer.analytics.dto";
export declare class EmployerAnalyticsService {
    private repository;
    constructor(repository: EmployerAnalyticsRepository);
    getEmployerAnalytics(employerId: string, timeRange: string): Promise<EmployerAnalyticsDTO>;
}
//# sourceMappingURL=employer.analytics.service.d.ts.map