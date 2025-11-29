import { IHomepageRepository } from "../../interfaces/homepage/IHomepageRepository";
import { HomepageRepository } from "../../repositories/homepage/homepage.repository";
import { HomepageStatsMapper } from "../../mappers/homepage/homepage.stats.mapper";
import { PublicStatsDTO } from "../../dto/homepage/homepage.stats.dto";

export class HomepageService {
  private repository: IHomepageRepository;

  constructor(repository: HomepageRepository) {
    this.repository = repository;
  }

  async getPublicStats(): Promise<PublicStatsDTO> {
    const stats = await this.repository.getPublicStats();
    return HomepageStatsMapper.toPublicStatsDTO(stats);
  }
}
