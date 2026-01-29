"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homepage_controller_1 = require("../../controllers/homepage/homepage.controller");
const homepage_service_1 = require("../../services/homepage/homepage.service");
const homepage_repository_1 = require("../../repositories/homepage/homepage.repository");
const router = (0, express_1.Router)();
const homepageRepository = new homepage_repository_1.HomepageRepository();
const homepageService = new homepage_service_1.HomepageService(homepageRepository);
const homepageController = new homepage_controller_1.HomepageController(homepageService);
router.get("/stats", homepageController.getPublicStats);
exports.default = router;
//# sourceMappingURL=homepage.routes.js.map