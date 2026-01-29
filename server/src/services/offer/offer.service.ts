import { IOfferService } from "../../interfaces/offers/IOfferService";
import { IOfferRepository } from "../../interfaces/offers/IOfferRepository";
import { IOfferQuery, IOfferWithJob } from "../../interfaces/offers/IOffer";

export class OfferService implements IOfferService {
  constructor(private _offerRepository: IOfferRepository) {}

  async getCandidateOffers(
    candidateId: string,
    query: IOfferQuery,
  ): Promise<{
    offers: IOfferWithJob[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [offers, total] = await Promise.all([
      this._offerRepository.findByCandidateId(candidateId, query),
      this._offerRepository.countByCandidateId(candidateId, {
        search: query.search || undefined,
        jobType: query.jobType || undefined,
      }),
    ]);

    return {
      offers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
