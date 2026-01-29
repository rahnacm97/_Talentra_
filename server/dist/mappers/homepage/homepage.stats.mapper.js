"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomepageStatsMapper = void 0;
class HomepageStatsMapper {
    static toPublicStatsDTO(stats) {
        return {
            activeJobs: stats.activeJobs,
            totalCompanies: stats.totalCompanies,
            successRate: stats.successRate,
            totalCandidates: stats.totalCandidates,
        };
    }
}
exports.HomepageStatsMapper = HomepageStatsMapper;
//# sourceMappingURL=homepage.stats.mapper.js.map