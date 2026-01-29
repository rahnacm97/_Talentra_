"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_controller_1 = require("../../controllers/candidate/candidate.controller");
const candidateApplication_controller_1 = require("../../controllers/candidate/candidateApplication.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const candidate_service_1 = require("../../services/candidate/candidate.service");
const application_service_1 = require("../../services/application/application.service");
const candidate_mapper_1 = require("../../mappers/candidate/candidate.mapper");
const candidate_repository_1 = require("../../repositories/candidate/candidate.repository");
const application_repository_1 = require("../../repositories/application/application.repository");
const job_repository_1 = require("../../repositories/job/job.repository");
const application_mapper_1 = require("../../mappers/application/application.mapper");
const multer_1 = require("../../config/multer");
const enums_1 = require("../../shared/enums/enums");
const NotificationAdapter_1 = require("../../services/notification/NotificationAdapter");
const router = (0, express_1.Router)();
//Dependendies
const candidateMapper = new candidate_mapper_1.CandidateMapper();
const candidateRepository = new candidate_repository_1.CandidateRepository();
const applRepository = new application_repository_1.ApplicationRepository();
const jobRepository = new job_repository_1.JobRepository();
const applMapper = new application_mapper_1.ApplicationMapper();
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
//Service with dependencies
const candidateService = new candidate_service_1.CandidateService(candidateRepository, candidateMapper);
const applicationService = new application_service_1.CandidateApplicationService(applRepository, jobRepository, applMapper, candidateService, notificationAdapter);
//Controller
const candidateController = new candidate_controller_1.CandidateController(candidateService, applicationService);
const candidateApplicationsController = new candidateApplication_controller_1.CandidateApplicationsController(applicationService);
//Routes
//router.use("/interviews", candidateInterviewRouter);
//Routes
router.get("/applications", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateApplicationsController.getMyApplications.bind(candidateApplicationsController));
router.get("/applications/:applicationId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateApplicationsController.getApplicationById.bind(candidateApplicationsController));
router.get("/profile", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateController.getProfile.bind(candidateController));
router.put("/profile", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), multer_1.upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
]), candidateController.updateProfile.bind(candidateController));
router.post("/jobs/:jobId/apply", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), multer_1.upload.single("resume"), candidateController.applyJob.bind(candidateController));
exports.default = router;
//# sourceMappingURL=candidate.routes.js.map