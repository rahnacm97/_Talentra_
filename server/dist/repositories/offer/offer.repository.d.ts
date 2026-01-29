import { IOfferRepository } from "../../interfaces/offers/IOfferRepository";
import { IOfferWithJob, IOfferQuery } from "../../interfaces/offers/IOffer";
export declare class OfferRepository implements IOfferRepository {
    findByCandidateId(candidateId: string, query: IOfferQuery): Promise<IOfferWithJob[]>;
    countByCandidateId(candidateId: string, filters: {
        search?: string;
        jobType?: string;
    }): Promise<number>;
}
//# sourceMappingURL=offer.repository.d.ts.map