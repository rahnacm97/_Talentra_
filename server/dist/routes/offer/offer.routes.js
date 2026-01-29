"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offer_controller_1 = require("../../controllers/offer/offer.controller");
const offer_service_1 = require("../../services/offer/offer.service");
const offer_repository_1 = require("../../repositories/offer/offer.repository");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const offer_mapper_1 = require("../../mappers/offer/offer.mapper");
const router = (0, express_1.Router)();
const offerRepository = new offer_repository_1.OfferRepository();
const offerService = new offer_service_1.OfferService(offerRepository);
const offerMapper = new offer_mapper_1.OfferMapper();
const offerController = new offer_controller_1.OfferController(offerService, offerMapper);
router.get("/my-offers", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), offerController.getCandidateOffers.bind(offerController));
exports.default = router;
//# sourceMappingURL=offer.routes.js.map