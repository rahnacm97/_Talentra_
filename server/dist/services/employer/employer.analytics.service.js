"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerAnalyticsService = void 0;
const employer_analytics_mapper_1 = require("../../mappers/employer/employer.analytics.mapper");
class EmployerAnalyticsService {
    constructor(repository) {
        this.repository = repository;
    }
    async getEmployerAnalytics(employerId, timeRange) {
        const [stats, applicationsOverTime, applicationsByStatus, jobPostingPerformance, hiringFunnel, timeToHire,] = await Promise.all([
            this.repository.getEmployerStats(employerId),
            this.repository.getApplicationsOverTime(employerId, timeRange),
            this.repository.getApplicationsByStatus(employerId),
            this.repository.getJobPostingPerformance(employerId),
            this.repository.getHiringFunnel(employerId),
            this.repository.getTimeToHire(employerId),
        ]);
        return employer_analytics_mapper_1.EmployerAnalyticsMapper.toEmployerAnalyticsDTO(stats, applicationsOverTime, applicationsByStatus, jobPostingPerformance, hiringFunnel, timeToHire);
    }
}
exports.EmployerAnalyticsService = EmployerAnalyticsService;
//# sourceMappingURL=employer.analytics.service.js.map