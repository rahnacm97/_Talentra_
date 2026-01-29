import { HomepageRepository } from "../../repositories/homepage/homepage.repository";
import { PublicStatsDTO } from "../../dto/homepage/homepage.stats.dto";
export declare class HomepageService {
    private repository;
    constructor(repository: HomepageRepository);
    getPublicStats(): Promise<PublicStatsDTO>;
}
//# sourceMappingURL=homepage.service.d.ts.map