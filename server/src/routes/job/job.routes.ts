import { Router, Request, Response, NextFunction } from "express";
import { verifyAuth, optionalAuth } from "../../middlewares/authMiddleware";
import {
  validate,
  verifyEmployer,
} from "../../middlewares/validationMiddleware";
import {
  createJobSchema,
  updateJobSchema,
} from "../../shared/validations/job.validation";
import { USER_ROLES } from "../../shared/enums/enums";
import { JobRepository } from "../../repositories/job/job.repository";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { FullyAuthenticatedRequest } from "../../type/types";
import { JobMapper } from "../../mappers/job/job.mapper";
import { EmployerJobService } from "../../services/job/job.service";
import { CandidateJobService } from "../../services/job/job.service";
import { EmployerJobController } from "../../controllers/job/employerJob.controller";
import { CandidateJobController } from "../../controllers/job/candidateJob.controller";
import { CandidateRepository } from "../../repositories/candidate/candidate.repository";

const jobRepo = new JobRepository();
const employerRepo = new EmployerRepository();
const applicationRepo = new ApplicationRepository();
const candRepo = new CandidateRepository();
const jobMapper = new JobMapper();

const employerService = new EmployerJobService(
  jobRepo,
  jobMapper,
  employerRepo,
);
const candidateService = new CandidateJobService(
  jobRepo,
  candRepo,
  jobMapper,
  applicationRepo,
);

const employerController = new EmployerJobController(employerService);
const candidateController = new CandidateJobController(candidateService);

const router = Router();

router.get(
  "/",
  optionalAuth,
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as unknown as FullyAuthenticatedRequest).user;

    if (user?.role === USER_ROLES.EMPLOYER) {
      return employerController.getJobs(req, res, next);
    }

    return candidateController.getPublicJobs(req, res, next);
  },
);

// Employer specific routes
router.post(
  "/",
  verifyAuth([USER_ROLES.EMPLOYER]),
  validate(createJobSchema),
  employerController.postJob.bind(employerController),
);

router.put(
  "/:jobId",
  verifyAuth([USER_ROLES.EMPLOYER]),
  validate(updateJobSchema),
  employerController.updateJob.bind(employerController),
);

router.patch(
  "/:jobId/close",
  verifyAuth([USER_ROLES.EMPLOYER]),
  employerController.closeJob.bind(employerController),
);

// Candidate specific routes
router.get(
  "/public/:id",
  candidateController.getJobById.bind(candidateController),
);

router.get(
  "/saved",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateController.getSavedJobs.bind(candidateController),
);

router.post(
  "/save/:jobId",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateController.saveJob.bind(candidateController),
);

router.delete(
  "/save/:jobId",
  verifyAuth([USER_ROLES.CANDIDATE]),
  candidateController.unsaveJob.bind(candidateController),
);

router.post(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  validate(createJobSchema),
  employerController.postJob.bind(employerController),
);

router.get(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  employerController.getJobs.bind(employerController),
);

router.put(
  "/:id/:jobId",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  validate(updateJobSchema),
  employerController.updateJob.bind(employerController),
);

router.patch(
  "/:id/:jobId/close",
  verifyAuth([USER_ROLES.EMPLOYER]),
  verifyEmployer,
  employerController.closeJob.bind(employerController),
);

export default router;
