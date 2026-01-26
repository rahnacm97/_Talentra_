import { Router, Request, Response, NextFunction } from "express";
import { verifyAuth, optionalAuth } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validationMiddleware";
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

//Dependencies
const jobRepo = new JobRepository();
const employerRepo = new EmployerRepository();
const applicationRepo = new ApplicationRepository();
const candRepo = new CandidateRepository();
const jobMapper = new JobMapper();
//Service with dependencies
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
//Controller
const employerController = new EmployerJobController(employerService);
const candidateController = new CandidateJobController(candidateService);

const router = Router();


router.get("/", candidateController.getPublicJobs.bind(candidateController));

router.get(
  "/",
  optionalAuth,
  (req: Request, res: Response, next: NextFunction) => {

    const user = (req as FullyAuthenticatedRequest).user;


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
  optionalAuth,
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

export default router;
