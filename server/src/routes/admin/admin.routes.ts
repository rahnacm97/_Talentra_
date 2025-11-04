import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/admin.authController";
import { AdminCandidateController } from "../../controllers/admin/admin.candidateController";
import { AdminEmployerController } from "../../controllers/admin/admin.employerController";
import { JobController } from "../../controllers/job/job.controller";
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
import { EmailService } from "../../services/auth/email.service";
import { JobService } from "../../services/job/job.service";
import { JobMapper } from "../../mappers/job/job.mapper";
import { JobRepository } from "../../repositories/job/job.repository";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";
import { USER_ROLES } from "../../shared/constants/constants";

const router = Router();
const adminRepository: IUserReader<IAdmin> = new AdminRepository();
const tokenService: ITokenService = new TokenService();
const adminMapper = new AdminMapper();
const candidateMapper = new CandidateMapper();
const employerMapper = new EmployerMapper();
const emailService = new EmailService();
const jobMapper = new JobMapper();
const jobRepo = new JobRepository();
const employerRepository = new EmployerRepository();
const applicationRepo = new ApplicationRepository();

const employerVerificationRepo: IEmployerVerificationRepo = employerRepository;

// Services
const adminAuthService = new AdminAuthService(
  adminRepository,
  tokenService,
  adminMapper,
);
const adminCandidateService = new AdminCandidateService(
  new CandidateRepository(),
  candidateMapper,
);
const adminEmployerService = new AdminEmployerService(
  new EmployerRepository(),
  employerMapper,
  emailService,
);
const jobService = new JobService(
  jobRepo,
  jobMapper,
  employerVerificationRepo,
  applicationRepo,
);

// Controllers
const adminAuthController = new AdminAuthController(adminAuthService);
const adminCandidateController = new AdminCandidateController(
  adminCandidateService,
);
const adminEmployerController = new AdminEmployerController(
  adminEmployerService,
);
const jobController = new JobController(jobService);

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

router.post("/logout", adminAuthController.logout);

export default router;
