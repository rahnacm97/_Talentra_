import { Router } from "express";
import { HomepageController } from "../../controllers/homepage/homepage.controller";
import { HomepageService } from "../../services/homepage/homepage.service";
import { HomepageRepository } from "../../repositories/homepage/homepage.repository";

const router = Router();

const homepageRepository = new HomepageRepository();
const homepageService = new HomepageService(homepageRepository);
const homepageController = new HomepageController(homepageService);

router.get("/stats", homepageController.getPublicStats);

export default router;
