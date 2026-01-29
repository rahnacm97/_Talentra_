"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferController = void 0;
class OfferController {
    constructor(_offerService, _offerMapper) {
        this._offerService = _offerService;
        this._offerMapper = _offerMapper;
    }
    async getCandidateOffers(req, res) {
        try {
            const candidateId = req.user.id;
            const { search, page, limit, jobType, sortBy, order } = req.query;
            const query = {
                search: search,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
                jobType: jobType,
                sortBy: sortBy,
                order: order,
            };
            const result = await this._offerService.getCandidateOffers(candidateId, query);
            res.status(200).json({
                success: true,
                data: this._offerMapper.toResponseDtoList(result.offers),
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        }
        catch (error) {
            console.error("Error fetching candidate offers:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.OfferController = OfferController;
//# sourceMappingURL=offer.controller.js.map