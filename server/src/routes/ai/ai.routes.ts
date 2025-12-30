import { Router } from "express";
import { AIController } from "../../controllers/ai/ai.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { AIService } from "../../services/ai/ai.service";
import { CandidateService } from "../../services/candidate/candidate.service";
import { CandidateJobService } from "../../services/job/job.service";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { CandidateMapper } from "../../mappers/candidate/candidate.mapper";
import { JobRepository } from "../../repositories/job/job.repository";
import { JobMapper } from "../../mappers/job/job.mapper";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { USER_ROLES } from "../../shared/enums/enums";

const router = Router();

// Dependencies
const candidateRepository = new CandidateRepository();
const candidateMapper = new CandidateMapper();
const jobRepository = new JobRepository();
const jobMapper = new JobMapper();
const applicationRepository = new ApplicationRepository();

// Services
const aiService = new AIService();
const candidateService = new CandidateService(
  candidateRepository,
  candidateMapper,
);
const jobService = new CandidateJobService(
  jobRepository,
  candidateRepository,
  jobMapper,
  applicationRepository,
);

// Controller
const aiController = new AIController(aiService, candidateService, jobService);

router.post(
  "/summarize-candidate",
  verifyAuth([USER_ROLES.EMPLOYER]),
  aiController.summarizeCandidate.bind(aiController),
);

router.post(
  "/match-score",
  verifyAuth([USER_ROLES.CANDIDATE]),
  aiController.getMatchScore.bind(aiController),
);

export default router;
