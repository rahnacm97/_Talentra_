"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomepageService = void 0;
const homepage_stats_mapper_1 = require("../../mappers/homepage/homepage.stats.mapper");
class HomepageService {
    constructor(repository) {
        this.repository = repository;
    }
    async getPublicStats() {
        const stats = await this.repository.getPublicStats();
        return homepage_stats_mapper_1.HomepageStatsMapper.toPublicStatsDTO(stats);
    }
}
exports.HomepageService = HomepageService;
//# sourceMappingURL=homepage.service.js.map