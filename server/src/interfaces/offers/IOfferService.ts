import { IOfferWithJob, IOfferQuery } from "./IOffer";

export interface IOfferService {
  getCandidateOffers(
    candidateId: string,
    query: IOfferQuery,
  ): Promise<{
    offers: IOfferWithJob[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
