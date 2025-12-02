import { Router } from "express";
import {
  EmployerController,
  EmployerApplicationsController,
  EmployerAnalyticsController,
} from "../../controllers/employer/employer.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { requireActiveSubscription } from "../../middlewares/subscriptionCheck";
import { EmployerService } from "../../services/employer/employer.service";
import {
  EmployerMapper,
  EmployerAnalyticsMapper,
} from "../../mappers/employer/employer.mapper";
import {
  EmployerRepository,
  EmployerAnalyticsRepository,
} from "../../repositories/employer/employer.repository";
import { upload } from "../../config/multer";
import jobRoutes from "../job/job.routes";
import { USER_ROLES } from "../../shared/enums/enums";
import { verifyEmployer } from "../../middlewares/validationMiddleware";
import { EmployerApplicationService } from "../../services/application/application.service";
import { EmployerApplicationMapper } from "../../mappers/application/application.mapper";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { InterviewRepository } from "../../repositories/interview/interview.repository";
import { InterviewService } from "../../services/interview/interview.service";
import { InterviewMapper } from "../../mappers/interview/interview.mapper";
import { employerInterviewRouter } from "../interview/interview.routes";
import { EmployerAnalyticsService } from "../../services/employer/employer.service";
import { JobRepository } from "../../repositories/job/job.repository";
import subscriptionRoutes from "../subscription/subscription.routes";

const router = Router();
//Dependencies
const employerMapper = new EmployerMapper();
const employerRepository = new EmployerRepository();
const employerService = new EmployerService(employerRepository, employerMapper);
const employerController = new EmployerController(employerService);
const applicationMapper = new EmployerApplicationMapper();
const applicationRepo = new ApplicationRepository();
const interviewRepo = new InterviewRepository();
const interviewMapper = new InterviewMapper();
const mapper = new EmployerAnalyticsMapper();
const jobRepo = new JobRepository();

//Service with dependency
const interviewService = new InterviewService(interviewRepo, interviewMapper);
const employerApplicationService = new EmployerApplicationService(
  applicationRepo,
  applicationMapper,
  interviewService,
);
const analyticsRepository = new EmployerAnalyticsRepository(
  jobRepo,
  applicationRepo,
  interviewRepo,
);
const analyticsService = new EmployerAnalyticsService(
  analyticsRepository,
  mapper,
);
//Controller
const employerApplicationsController = new EmployerApplicationsController(
  employerApplicationService,
);
const analyticsController = new EmployerAnalyticsController(analyticsService);
//Routes
router.use("/subscription", subscriptionRoutes);

router.use("/interviews", requireActiveSubscription, employerInterviewRouter);

router.get(
  "/analytics",
  verifyAuth([USER_ROLES.EMPLOYER]),
  requireActiveSubscription,
  analyticsController.getEmployerAnalytics,
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
  requireActiveSubscription,
  employerApplicationsController.getApplications.bind(
    employerApplicationsController,
  ),
);

router.patch(
  "/:id/applications/:applicationId/status",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  requireActiveSubscription,
  employerApplicationsController.updateApplicationStatus.bind(
    employerApplicationsController,
  ),
);

router.use("/jobs", requireActiveSubscription, jobRoutes);

export default router;
