import { IPublicStats } from "../../interfaces/homepage/IHomepageRepository";
import { PublicStatsDTO } from "../../dto/homepage/homepage.stats.dto";

export class HomepageStatsMapper {
  static toPublicStatsDTO(stats: IPublicStats): PublicStatsDTO {
    return {
      activeJobs: stats.activeJobs,
      totalCompanies: stats.totalCompanies,
      successRate: stats.successRate,
      totalCandidates: stats.totalCandidates,
    };
  }
}
