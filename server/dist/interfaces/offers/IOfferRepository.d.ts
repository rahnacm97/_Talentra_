import { IOfferWithJob, IOfferQuery } from "./IOffer";
export interface IOfferRepository {
    findByCandidateId(candidateId: string, query: IOfferQuery): Promise<IOfferWithJob[]>;
    countByCandidateId(candidateId: string, filters: {
        search?: string | undefined;
        jobType?: string | undefined;
    }): Promise<number>;
}
//# sourceMappingURL=IOfferRepository.d.ts.map