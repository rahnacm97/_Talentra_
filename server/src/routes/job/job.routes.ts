import { Router } from "express";
import { JobController } from "../../controllers/job/job.controller";
import { JobService } from "../../services/job/job.service";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { JobRepository } from "../../repositories/job/job.repository";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { JobMapper } from "../../mappers/job/job.mapper";
import { ApplicationRepository } from "../../repositories/application/application.repository";
import { USER_ROLES } from "../../shared/constants/constants";

const router = Router();
const mapper = new JobMapper();
const repository = new JobRepository();
const employerRepo = new EmployerRepository();
const applicationRepo = new ApplicationRepository();
const service = new JobService(
  repository,
  mapper,
  employerRepo,
  applicationRepo,
);
const jobcontroller = new JobController(service);

router.post(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  jobcontroller.postJob.bind(jobcontroller),
);

router.get(
  "/:id",
  verifyAuth([USER_ROLES.EMPLOYER]),
  jobcontroller.getJobs.bind(jobcontroller),
);

router.put(
  "/:id/:jobId",
  verifyAuth([USER_ROLES.EMPLOYER]),
  jobcontroller.updateJob.bind(jobcontroller),
);

router.patch(
  "/:id/:jobId/close",
  verifyAuth([USER_ROLES.EMPLOYER]),
  jobcontroller.closeJob.bind(jobcontroller),
);

router.get("/", jobcontroller.getPublicJobs.bind(jobcontroller));
router.get("/public/:id", jobcontroller.getJobById.bind(jobcontroller));

export default router;
