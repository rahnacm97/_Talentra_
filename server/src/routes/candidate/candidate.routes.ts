import { Router } from "express";
import { CandidateController } from "../../controllers/candidate/candidate.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";

const router = Router();
const candidateController = new CandidateController();

router.get("/:id", verifyAuth(["Candidate"]),candidateController.getProfile);

export default router;
