import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/admin.authController";
import { AdminCandidateController } from "../../controllers/admin/admin.candidateController";
import { AdminEmployerController } from "../../controllers/admin/admin.employerController";
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

const router = Router();
const adminRepository: IUserReader<IAdmin> = new AdminRepository();
const tokenService: ITokenService = new TokenService();

// Services
const adminAuthService = new AdminAuthService(adminRepository, tokenService);
const adminCandidateService = new AdminCandidateService(
  new CandidateRepository(),
);
const adminEmployerService = new AdminEmployerService(new EmployerRepository());

// Controllers
const adminAuthController = new AdminAuthController(adminAuthService);
const adminCandidateController = new AdminCandidateController(
  adminCandidateService,
);
const adminEmployerController = new AdminEmployerController(
  adminEmployerService,
);

// Routes
router.post("/login", adminAuthController.login);
router.get(
  "/candidates",
  verifyAuth(["Admin"]),
  adminCandidateController.getAllCandidates,
);
router.get(
  "/candidates/:id",
  verifyAuth(["Admin"]),
  adminCandidateController.getCandidateById,
);
router.patch(
  "/candidates/block-unblock",
  verifyAuth(["Admin"]),
  adminCandidateController.blockUnblockCandidate,
);
router.get(
  "/employers",
  verifyAuth(["Admin"]),
  adminEmployerController.getAllEmployers,
);
router.get(
  "/employers/:id",
  verifyAuth(["Admin"]),
  adminEmployerController.getEmployerById,
);
router.patch(
  "/employers/block-unblock",
  verifyAuth(["Admin"]),
  adminEmployerController.blockUnblockEmployer,
);
router.post("/logout", adminAuthController.logout);

export default router;
