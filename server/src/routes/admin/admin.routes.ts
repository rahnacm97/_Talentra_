import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/admin.authController";
import { AdminCandidateController } from "../../controllers/admin/admin.candidateController";
import { AdminEmployerController } from "../../controllers/admin/admin.employerController";
import { AdminJobController } from "../../controllers/job/adminJob.controller";
import { AdminAuthService } from "../../services/admin/admin.authService";
import { AdminCandidateService } from "../../services/admin/admin.candidateService";
import { AdminEmployerService } from "../../services/admin/admin.employerService";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { TokenService } from "../../services/auth/token.service";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { IUserReader } from "../../interfaces/auth/IAuthRepository";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import { AdminMapper } from "../../mappers/admin/admin.mapper";
import { CandidateMapper } from "../../mappers/admin/adminCandidate.mapper";
import { EmployerMapper } from "../../mappers/admin/adminEmployer.mapper";
import { NotificationAdapter } from "../../services/notification/NotificationAdapter";
import { AdminJobService } from "../../services/job/job.service";
import { AdminJobMapper } from "../../mappers/admin/adminJob.mapper";
import { JobRepository } from "../../repositories/job/job.repository";
import { USER_ROLES } from "../../shared/enums/enums";
import { AdminAnalyticsController } from "../../controllers/admin/admin.analytics.controller";
import { AdminAnalyticsService } from "../../services/admin/admin.analytics.service";
import { AdminAnalyticsRepository } from "../../repositories/admin/admin.analytics.repository";

const router = Router();
const adminRepository: IUserReader<IAdmin> = new AdminRepository();
const tokenService: ITokenService = new TokenService();
const adminMapper = new AdminMapper();
const candidateMapper = new CandidateMapper();
const employerMapper = new EmployerMapper();
const notificationAdapter = new NotificationAdapter();
const adminJobMapper = new AdminJobMapper();
const jobRepo = new JobRepository();

// Services
const adminAuthService = new AdminAuthService(
  adminRepository,
  tokenService,
  adminMapper,
);
const adminCandidateService = new AdminCandidateService(
  new CandidateRepository(),
  candidateMapper,
  notificationAdapter,
);
const adminEmployerService = new AdminEmployerService(
  new EmployerRepository(),
  employerMapper,
  notificationAdapter,
);
const jobService = new AdminJobService(jobRepo, adminJobMapper);
const analyticsRepository = new AdminAnalyticsRepository();
const analyticsService = new AdminAnalyticsService(analyticsRepository);

// Controllers
const adminAuthController = new AdminAuthController(adminAuthService);
const adminCandidateController = new AdminCandidateController(
  adminCandidateService,
);
const adminEmployerController = new AdminEmployerController(
  adminEmployerService,
);
const jobController = new AdminJobController(jobService);
const analyticsController = new AdminAnalyticsController(analyticsService);

// Routes
router.post("/login", adminAuthController.login);
router.get(
  "/candidates",
  verifyAuth([USER_ROLES.ADMIN]),
  adminCandidateController.getAllCandidates,
);
router.get(
  "/candidates/:id",
  verifyAuth([USER_ROLES.ADMIN]),
  adminCandidateController.getCandidateById,
);
router.patch(
  "/candidates/block-unblock",
  verifyAuth([USER_ROLES.ADMIN]),
  adminCandidateController.blockUnblockCandidate,
);
router.get(
  "/employers",
  verifyAuth([USER_ROLES.ADMIN]),
  adminEmployerController.getAllEmployers,
);
router.get(
  "/employers/:id",
  verifyAuth([USER_ROLES.ADMIN]),
  adminEmployerController.getEmployerById,
);
router.patch(
  "/employers/block-unblock",
  verifyAuth([USER_ROLES.ADMIN]),
  adminEmployerController.blockUnblockEmployer,
);
router.patch(
  "/employers/:id/verify",
  verifyAuth([USER_ROLES.ADMIN]),
  adminEmployerController.verifyEmployer,
);
router.patch(
  "/employers/:id/reject",
  verifyAuth([USER_ROLES.ADMIN]),
  adminEmployerController.rejectEmployer,
);

router.get(
  "/jobs",
  verifyAuth([USER_ROLES.ADMIN]),
  jobController.getAdminJobs.bind(jobController),
);

router.get(
  "/analytics/dashboard",
  verifyAuth([USER_ROLES.ADMIN]),
  analyticsController.getDashboardAnalytics,
);

router.post("/logout", adminAuthController.logout);

export default router;
