import { Router } from "express";
import { OfferController } from "../../controllers/offer/offer.controller";
import { OfferService } from "../../services/offer/offer.service";
import { OfferRepository } from "../../repositories/offer/offer.repository";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";
import { OfferMapper } from "../../mappers/offer/offer.mapper";

const router = Router();

const offerRepository = new OfferRepository();
const offerService = new OfferService(offerRepository);
const offerMapper = new OfferMapper();
const offerController = new OfferController(offerService, offerMapper);

router.get(
  "/my-offers",
  verifyAuth([USER_ROLES.CANDIDATE]),
  offerController.getCandidateOffers.bind(offerController),
);

export default router;
