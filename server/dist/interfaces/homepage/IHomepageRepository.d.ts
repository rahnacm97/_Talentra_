export interface IPublicStats {
    activeJobs: number;
    totalCompanies: number;
    successRate: number;
    totalCandidates: number;
}
export interface IHomepageRepository {
    getPublicStats(): Promise<IPublicStats>;
}
//# sourceMappingURL=IHomepageRepository.d.ts.map