import { Router } from "express";
import {
  CandidateApplicationsController,
  CandidateController,
} from "../../controllers/candidate/candidate.controller";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { CandidateService } from "../../services/candidate/candidate.service";
import { CandidateApplicationService } from "../../services/application/application.service";
import { CandidateMapper } from "../../mappers/candidate/candidate.mapper";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { JobRepository } from "../../repositories/job/job.repository";
import { ApplicationMapper } from "../../mappers/application/application.mapper";
import { upload } from "../../config/multer";
import { USER_ROLES } from "../../shared/enums/enums";
import { verifyCandidate } from "../../middlewares/validationMiddleware";
import { candidateInterviewRouter } from "../interview/interview.routes";

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
const applicationService = new CandidateApplicationService(
  applRepository,
  jobRepository,
  applMapper,
  candidateService,
);
const candidateController = new CandidateController(
  candidateService,
  applicationService,
);

const candidateApplicationsController = new CandidateApplicationsController(
  applicationService,
);

router.use("/interviews", candidateInterviewRouter);

router.get(
  "/applications",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateApplicationsController.getMyApplications.bind(
    candidateApplicationsController,
  ),
);

router.get(
  "/applications/:applicationId",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateApplicationsController.getApplicationById.bind(
    candidateApplicationsController,
  ),
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
  verifyCandidate,
  upload.single("resume"),
  candidateController.applyJob.bind(candidateController),
);

export default router;
