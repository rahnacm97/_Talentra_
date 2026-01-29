"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferService = void 0;
class OfferService {
    constructor(_offerRepository) {
        this._offerRepository = _offerRepository;
    }
    async getCandidateOffers(candidateId, query) {
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
exports.OfferService = OfferService;
//# sourceMappingURL=offer.service.js.map