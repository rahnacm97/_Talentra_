import { Router } from "express";
import { CandidateController } from "../../controllers/candidate/candidate.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { CandidateService } from "../../services/candidate/candidate.service";
import { ApplicationService } from "../../services/application/application.service";
import { CandidateMapper } from "../../mappers/candidate/candidate.mapper";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { JobRepository } from "../../repositories/job/job.repository";
import { ApplicationMapper } from "../../mappers/application/application.mapper";
import { upload } from "../../config/multer";
import { USER_ROLES } from "../../shared/constants/constants";

const router = Router();
const candidateMapper = new CandidateMapper();
const candidateRepository = new CandidateRepository();

const candidateService = new CandidateService(
  candidateRepository,
  candidateMapper,
);
const applRepository = new ApplicationRepository();
const jobRepository = new JobRepository();
const applMapper = new ApplicationMapper();
const applicationService = new ApplicationService(
  applRepository,
  jobRepository,
  applMapper,
);
const candidateController = new CandidateController(
  candidateService,
  applicationService,
);

router.get(
  "/:id",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateController.getProfile.bind(candidateController),
);

router.put(
  "/:id",
  verifyAuth([USER_ROLES.CANDIDATE]),
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  candidateController.updateProfile.bind(candidateController),
);

router.post(
  "/:candidateId/jobs/:jobId/apply",
  verifyAuth([USER_ROLES.CANDIDATE]),
  upload.single("resume"),
  candidateController.applyJob.bind(candidateController),
);

export default router;
