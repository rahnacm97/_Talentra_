"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerAnalyticsMapper = exports.EmployerMapper = void 0;
class EmployerMapper {
    toProfileDataDTO(employer) {
        return {
            name: employer.name || "",
            email: employer.email || "",
            phone: employer.phoneNumber || "",
            location: employer.location || "",
            website: employer.website || "",
            industry: employer.industry || "",
            companySize: employer.companySize || "",
            founded: employer.founded || "",
            about: employer.about || "",
            benefits: employer.benefits || [],
            socialLinks: employer.socialLinks || {
                linkedin: "",
                twitter: "",
                facebook: "",
            },
            cinNumber: employer.cinNumber || "",
            businessLicense: employer.businessLicense || "",
            profileImage: employer.profileImage || "",
        };
    }
}
exports.EmployerMapper = EmployerMapper;
class EmployerAnalyticsMapper {
    toEmployerStatsDTO(stats) {
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
    toApplicationOverTimeDTO(data) {
        return {
            date: data.date,
            applications: data.applications,
            views: data.views,
        };
    }
    toApplicationByStatusDTO(data) {
        return {
            name: data.name,
            value: data.value,
            color: data.color,
        };
    }
    toJobPerformanceDTO(data) {
        return {
            job: data.job,
            jobId: data.jobId,
            applications: data.applications,
            views: data.views,
            conversionRate: data.conversionRate,
        };
    }
    toHiringStageDTO(data) {
        return {
            stage: data.stage,
            count: data.count,
            percentage: data.percentage,
        };
    }
    toTimeToHireDTO(data) {
        return {
            position: data.position,
            days: data.days,
        };
    }
    toEmployerAnalyticsDTO(stats, applicationsOverTime, applicationsByStatus, jobPostingPerformance, hiringFunnel, timeToHire) {
        return {
            stats: this.toEmployerStatsDTO(stats),
            applicationsOverTime: applicationsOverTime.map((item) => this.toApplicationOverTimeDTO(item)),
            applicationsByStatus: applicationsByStatus.map((item) => this.toApplicationByStatusDTO(item)),
            jobPostingPerformance: jobPostingPerformance.map((item) => this.toJobPerformanceDTO(item)),
            hiringFunnel: hiringFunnel.map((item) => this.toHiringStageDTO(item)),
            timeToHire: timeToHire.map((item) => this.toTimeToHireDTO(item)),
        };
    }
}
exports.EmployerAnalyticsMapper = EmployerAnalyticsMapper;
//# sourceMappingURL=employer.mapper.js.map