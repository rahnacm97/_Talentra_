import { Router } from "express";
import { EmployerController } from "../../controllers/employer/employer.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";

const router = Router();
const employerController = new EmployerController();

router.get("/:id", verifyAuth("Employer"), employerController.getProfile);

export default router;