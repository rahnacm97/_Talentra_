import { Router } from "express";
<<<<<<< Updated upstream
import {
  EmployerController,
  EmployerApplicationsController,
} from "../../controllers/employer/employer.controller";
=======
import { EmployerController } from "../../controllers/employer/employer.controller";
import { EmployerAnalyticsController } from "../../controllers/employer/employerAnalytics.controller";
import { EmployerApplicationsController } from "../../controllers/employer/employerApplication.controller";
>>>>>>> Stashed changes
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
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { InterviewRepository } from "../../repositories/interview/interview.repository";
import { InterviewService } from "../../services/interview/interview.service";
import { InterviewMapper } from "../../mappers/interview/interview.mapper";
<<<<<<< Updated upstream
import { employerInterviewRouter } from "../interview/interview.routes";
import { EmployerAnalyticsController } from "../../controllers/employer/employer.analytics.controller";
import { EmployerAnalyticsService } from "../../services/employer/employer.analytics.service";
import { EmployerAnalyticsRepository } from "../../repositories/employer/employer.analytics.repository";
=======
import { EmployerAnalyticsService } from "../../services/employer/employer.service";
import { JobRepository } from "../../repositories/job/job.repository";
import subscriptionRoutes from "../subscription/subscription.routes";
import { ChatService } from "../../services/chat/chat.service";
import { ChatRepository } from "../../repositories/chat/chat.repository";
import { ChatMapper } from "../../mappers/chat/chat.mapper";
import { ChatSocket } from "../../socket/chat.socket";
import { NotificationSocket } from "../../socket/notification.socket";
import { NotificationAdapter } from "../../services/notification/NotificationAdapter";
>>>>>>> Stashed changes

const router = Router();
const employerMapper = new EmployerMapper();
const employerRepository = new EmployerRepository();
const notificationAdapter = new NotificationAdapter();
const employerService = new EmployerService(
  employerRepository,
  employerMapper,
  notificationAdapter,
);
const employerController = new EmployerController(employerService);
const applicationMapper = new EmployerApplicationMapper();
const applicationRepo = new ApplicationRepository();
const interviewRepo = new InterviewRepository();
const interviewMapper = new InterviewMapper();
<<<<<<< Updated upstream
const interviewService = new InterviewService(interviewRepo, interviewMapper);
=======
const mapper = new EmployerAnalyticsMapper();
const jobRepo = new JobRepository();
const chatRepository = new ChatRepository();
const chatMapper = new ChatMapper();
const chatSocket = ChatSocket.getInstance();
const notificationSocket = NotificationSocket.getInstance();

//Service with dependency
const interviewService = new InterviewService(interviewRepo, interviewMapper);
const chatService = new ChatService(
  chatRepository,
  applicationRepo,
  chatMapper,
  chatSocket,
  notificationSocket,
);
>>>>>>> Stashed changes
const employerApplicationService = new EmployerApplicationService(
  applicationRepo,
  applicationMapper,
  notificationAdapter,
  interviewService,
);
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
const employerApplicationsController = new EmployerApplicationsController(
  employerApplicationService,
);
const analyticsRepository = new EmployerAnalyticsRepository();
const analyticsService = new EmployerAnalyticsService(analyticsRepository);
const analyticsController = new EmployerAnalyticsController(analyticsService);

<<<<<<< Updated upstream
router.use("/interviews", employerInterviewRouter);

router.get(
  "/analytics",
  verifyAuth([USER_ROLES.EMPLOYER]),
  analyticsController.getEmployerAnalytics,
=======
router.get(
  "/analytics",
  verifyAuth([USER_ROLES.EMPLOYER]),
  requireActiveSubscription,
  analyticsController.getEmployerAnalytics.bind(analyticsController),
>>>>>>> Stashed changes
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
