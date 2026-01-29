"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../../controllers/ai/ai.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const ai_service_1 = require("../../services/ai/ai.service");
const candidate_service_1 = require("../../services/candidate/candidate.service");
const job_service_1 = require("../../services/job/job.service");
const candidate_repository_1 = require("../../repositories/candidate/candidate.repository");
const candidate_mapper_1 = require("../../mappers/candidate/candidate.mapper");
const job_repository_1 = require("../../repositories/job/job.repository");
const job_mapper_1 = require("../../mappers/job/job.mapper");
const application_repository_1 = require("../../repositories/application/application.repository");
const enums_1 = require("../../shared/enums/enums");
const router = (0, express_1.Router)();
// Dependencies
const candidateRepository = new candidate_repository_1.CandidateRepository();
const candidateMapper = new candidate_mapper_1.CandidateMapper();
const jobRepository = new job_repository_1.JobRepository();
const jobMapper = new job_mapper_1.JobMapper();
const applicationRepository = new application_repository_1.ApplicationRepository();
// Services
const aiService = new ai_service_1.AIService();
const candidateService = new candidate_service_1.CandidateService(candidateRepository, candidateMapper);
const jobService = new job_service_1.CandidateJobService(jobRepository, candidateRepository, jobMapper, applicationRepository);
// Controller
const aiController = new ai_controller_1.AIController(aiService, candidateService, jobService);
router.post("/summarize-candidate", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), aiController.summarizeCandidate.bind(aiController));
router.post("/match-score", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), aiController.getMatchScore.bind(aiController));
exports.default = router;
//# sourceMappingURL=ai.routes.js.map