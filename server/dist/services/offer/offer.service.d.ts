import { IOfferService } from "../../interfaces/offers/IOfferService";
import { IOfferRepository } from "../../interfaces/offers/IOfferRepository";
import { IOfferQuery, IOfferWithJob } from "../../interfaces/offers/IOffer";
export declare class OfferService implements IOfferService {
    private _offerRepository;
    constructor(_offerRepository: IOfferRepository);
    getCandidateOffers(candidateId: string, query: IOfferQuery): Promise<{
        offers: IOfferWithJob[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
//# sourceMappingURL=offer.service.d.ts.map