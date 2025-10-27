import { Router } from "express";
import { CandidateController } from "../../controllers/candidate/candidate.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { CandidateService } from "../../services/candidate/candidate.service";
import { CandidateMapper } from "../../mappers/candidate/candidate.mapper";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { upload } from "../../config/multer";

const router = Router();
const candidateMapper = new CandidateMapper();
const candidateRepository = new CandidateRepository();

const candidateService = new CandidateService(
  candidateRepository,
  candidateMapper,
);
const candidateController = new CandidateController(candidateService);

router.get(
  "/:id",
  verifyAuth(["Candidate"]),
  candidateController.getProfile.bind(candidateController),
);

router.put(
  "/:id",
  verifyAuth(["Candidate"]),
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  candidateController.updateProfile.bind(candidateController),
);

export default router;
