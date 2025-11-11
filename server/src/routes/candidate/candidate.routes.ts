import { Router } from "express";
import { CandidateController } from "../../controllers/candidate/candidate.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { CandidateService } from "../../services/candidate/candidate.service";

const router = Router();
const candidateService = new CandidateService();
const candidateController = new CandidateController(candidateService);

router.get(
  "/:id",
  verifyAuth(["Candidate"]),
  candidateController.getProfile.bind(candidateController),
);

export default router;
