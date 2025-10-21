import { Router } from "express";
import { EmployerController } from "../../controllers/employer/employer.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { EmployerService } from "../../services/employer/employer.service";

const router = Router();
const employerService = new EmployerService();
const employerController = new EmployerController(employerService);

router.get(
  "/:id",
  verifyAuth(["Employer"]),
  employerController.getProfile.bind(employerController),
);

export default router;
