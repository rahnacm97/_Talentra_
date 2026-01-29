import { Request, Response } from "express";
import { IOfferService } from "../../interfaces/offers/IOfferService";
import { IOfferMapper } from "../../interfaces/offers/IOfferMapper";
import { IOfferController } from "../../interfaces/offers/IOfferController";
export declare class OfferController implements IOfferController {
    private _offerService;
    private _offerMapper;
    constructor(_offerService: IOfferService, _offerMapper: IOfferMapper);
    getCandidateOffers(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=offer.controller.d.ts.map