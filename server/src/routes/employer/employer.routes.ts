import { Router } from "express";
import { EmployerController } from "../../controllers/employer/employer.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { EmployerService } from "../../services/employer/employer.service";
import { EmployerMapper } from "../../mappers/employer/employer.mapper";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { upload } from "../../config/multer";
import jobRoutes from "../job/job.routes";
import { USER_ROLES } from "../../shared/constants/constants";

const router = Router();
const employerMapper = new EmployerMapper();
const employerRepository = new EmployerRepository();
const employerService = new EmployerService(employerRepository, employerMapper);
const employerController = new EmployerController(employerService);

router.get(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  employerController.getProfile.bind(employerController),
);

router.put(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  employerController.updateProfile.bind(employerController),
);

router.use("/jobs", jobRoutes);

export default router;
