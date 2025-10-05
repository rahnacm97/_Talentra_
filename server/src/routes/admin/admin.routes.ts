import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/admin.authController";
import { AdminCandidateController } from "../../controllers/admin/admin.candidateController";
import { AdminEmployerController } from "../../controllers/admin/admin.employerController";
import { AdminAuthService } from "../../services/admin/admin.authService";
import { AdminCandidateService } from "../../services/admin/admin.candidateService";
import { AdminEmployerService } from "../../services/admin/admin.employerService";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { EmployerRepository } from "../../repositories/employer/employer.repository";

const router = Router();

// Services
const adminAuthService = new AdminAuthService();
const adminCandidateService = new AdminCandidateService(new CandidateRepository());
const adminEmployerService = new AdminEmployerService(new EmployerRepository());

// Controllers
const adminAuthController = new AdminAuthController(adminAuthService);
const adminCandidateController = new AdminCandidateController(adminCandidateService);
const adminEmployerController = new AdminEmployerController(adminEmployerService);

// Routes
router.post("/login", adminAuthController.login);
router.get("/candidates", adminCandidateController.getAllCandidates);
router.get("/candidates/:id", adminCandidateController.getCandidateById);
router.patch("/block-unblock", adminCandidateController.blockUnblockCandidate);
router.get("/employers", adminEmployerController.getAllEmployers);
router.get("/employers/:id", adminEmployerController.getEmployerById);
router.patch("/block", adminEmployerController.blockUnblockEmployer);

export default router;
