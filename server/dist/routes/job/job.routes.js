"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const job_validation_1 = require("../../shared/validations/job.validation");
const enums_1 = require("../../shared/enums/enums");
const job_repository_1 = require("../../repositories/job/job.repository");
const employer_repository_1 = require("../../repositories/employer/employer.repository");
const application_repository_1 = require("../../repositories/application/application.repository");
const job_mapper_1 = require("../../mappers/job/job.mapper");
const job_service_1 = require("../../services/job/job.service");
const job_service_2 = require("../../services/job/job.service");
const employerJob_controller_1 = require("../../controllers/job/employerJob.controller");
const candidateJob_controller_1 = require("../../controllers/job/candidateJob.controller");
const candidate_repository_1 = require("../../repositories/candidate/candidate.repository");
//Dependencies
const jobRepo = new job_repository_1.JobRepository();
const employerRepo = new employer_repository_1.EmployerRepository();
const applicationRepo = new application_repository_1.ApplicationRepository();
const candRepo = new candidate_repository_1.CandidateRepository();
const jobMapper = new job_mapper_1.JobMapper();
//Service with dependencies
const employerService = new job_service_1.EmployerJobService(jobRepo, jobMapper, employerRepo);
const candidateService = new job_service_2.CandidateJobService(jobRepo, candRepo, jobMapper, applicationRepo);
//Controller
const employerController = new employerJob_controller_1.EmployerJobController(employerService);
const candidateController = new candidateJob_controller_1.CandidateJobController(candidateService);
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.optionalAuth, (req, res, next) => {
    const user = req.user;
    if (user?.role === enums_1.USER_ROLES.EMPLOYER) {
        return employerController.getJobs(req, res, next);
    }
    return candidateController.getPublicJobs(req, res, next);
});
// Employer specific routes
router.post("/", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), (0, validationMiddleware_1.validate)(job_validation_1.createJobSchema), employerController.postJob.bind(employerController));
router.put("/:jobId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), (0, validationMiddleware_1.validate)(job_validation_1.updateJobSchema), employerController.updateJob.bind(employerController));
router.patch("/:jobId/close", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), employerController.closeJob.bind(employerController));
// Candidate specific routes
router.get("/public/:id", authMiddleware_1.optionalAuth, candidateController.getJobById.bind(candidateController));
router.get("/saved", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateController.getSavedJobs.bind(candidateController));
router.post("/save/:jobId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateController.saveJob.bind(candidateController));
router.delete("/save/:jobId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateController.unsaveJob.bind(candidateController));
exports.default = router;
//# sourceMappingURL=job.routes.js.map