import { Router } from "express";
import {
  EmployerController,
  EmployerApplicationsController,
} from "../../controllers/employer/employer.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import type {} from "../../middlewares/subscriptionCheck";
import { EmployerService } from "../../services/employer/employer.service";
import { EmployerMapper } from "../../mappers/employer/employer.mapper";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { upload } from "../../config/multer";
import jobRoutes from "../job/job.routes";
import { USER_ROLES } from "../../shared/enums/enums";
import { verifyEmployer } from "../../middlewares/validationMiddleware";
import { EmployerApplicationService } from "../../services/application/application.service";
import { EmployerApplicationMapper } from "../../mappers/application/application.mapper";
import { JobRepository } from "../../repositories/job/job.repository";
import { ApplicationRepository } from "../../repositories/application/application.repository";

const router = Router();
const employerMapper = new EmployerMapper();
const employerRepository = new EmployerRepository();
const employerService = new EmployerService(employerRepository, employerMapper);
const employerController = new EmployerController(employerService);
const applicationMapper = new EmployerApplicationMapper();
const jobRepo = new JobRepository();
const applicationRepo = new ApplicationRepository();
const employerApplicationService = new EmployerApplicationService(
  applicationRepo,
  jobRepo,
  applicationMapper,
);
const employerApplicationsController = new EmployerApplicationsController(
  employerApplicationService,
);

router.get(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  employerController.getProfile.bind(employerController),
);

router.put(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  employerController.updateProfile.bind(employerController),
);

router.get(
  "/:id/applications",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  employerApplicationsController.getApplications.bind(
    employerApplicationsController,
  ),
);

router.patch(
  "/:id/applications/:applicationId/status",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  employerApplicationsController.updateApplicationStatus.bind(
    employerApplicationsController,
  ),
);

router.use("/jobs", jobRoutes);

export default router;
