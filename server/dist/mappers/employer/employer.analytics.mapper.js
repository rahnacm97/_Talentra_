"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerAnalyticsMapper = void 0;
class EmployerAnalyticsMapper {
    static toEmployerStatsDTO(stats) {
        return {
            totalApplications: stats.totalApplications,
            totalViews: stats.totalViews,
            activeJobs: stats.activeJobs,
            avgTimeToHire: stats.avgTimeToHire,
            totalHired: stats.totalHired,
            conversionRate: stats.conversionRate,
            offerAcceptanceRate: stats.offerAcceptanceRate,
            activePipeline: stats.activePipeline,
        };
    }
    static toApplicationOverTimeDTO(data) {
        return {
            date: data.date,
            applications: data.applications,
            views: data.views,
        };
    }
    static toApplicationByStatusDTO(data) {
        return {
            name: data.name,
            value: data.value,
            color: data.color,
        };
    }
    static toJobPerformanceDTO(data) {
        return {
            job: data.job,
            jobId: data.jobId,
            applications: data.applications,
            views: data.views,
            conversionRate: data.conversionRate,
        };
    }
    static toHiringFunnelStageDTO(data) {
        return {
            stage: data.stage,
            count: data.count,
            percentage: data.percentage,
        };
    }
    static toTimeToHireDTO(data) {
        return {
            position: data.position,
            days: data.days,
        };
    }
    static toEmployerAnalyticsDTO(stats, applicationsOverTime, applicationsByStatus, jobPostingPerformance, hiringFunnel, timeToHire) {
        return {
            stats: this.toEmployerStatsDTO(stats),
            applicationsOverTime: applicationsOverTime.map((item) => this.toApplicationOverTimeDTO(item)),
            applicationsByStatus: applicationsByStatus.map((item) => this.toApplicationByStatusDTO(item)),
            jobPostingPerformance: jobPostingPerformance.map((item) => this.toJobPerformanceDTO(item)),
            hiringFunnel: hiringFunnel.map((item) => this.toHiringFunnelStageDTO(item)),
            timeToHire: timeToHire.map((item) => this.toTimeToHireDTO(item)),
        };
    }
}
exports.EmployerAnalyticsMapper = EmployerAnalyticsMapper;
//# sourceMappingURL=employer.analytics.mapper.js.map