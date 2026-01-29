import { Request, Response } from "express";
import { IOfferService } from "../../interfaces/offers/IOfferService";
import { IOfferMapper } from "../../interfaces/offers/IOfferMapper";
import { IOfferController } from "../../interfaces/offers/IOfferController";
import { IOfferQuery } from "../../interfaces/offers/IOffer";

export class OfferController implements IOfferController {
  constructor(
    private _offerService: IOfferService,
    private _offerMapper: IOfferMapper,
  ) {}

  async getCandidateOffers(req: Request, res: Response): Promise<void> {
    try {
      const candidateId = req.user!.id;
      const { search, page, limit, jobType, sortBy, order } = req.query;

      const query: IOfferQuery = {
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        jobType: jobType as string,
        sortBy: sortBy as IOfferQuery["sortBy"],
        order: order as IOfferQuery["order"],
      } as IOfferQuery;

      const result = await this._offerService.getCandidateOffers(
        candidateId,
        query,
      );

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
    } catch (error) {
      console.error("Error fetching candidate offers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
