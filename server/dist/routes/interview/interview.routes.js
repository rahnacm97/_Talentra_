"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const interviewCandidate_controller_1 = require("../../controllers/interview/interviewCandidate.controller");
const interviewEmployer_controller_1 = require("../../controllers/interview/interviewEmployer.controller");
const interview_service_1 = require("../../services/interview/interview.service");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
const interview_mapper_1 = require("../../mappers/interview/interview.mapper");
const NotificationAdapter_1 = require("../../services/notification/NotificationAdapter");
const interviewRound_controller_1 = require("../../controllers/interview/interviewRound.controller");
const interviewRound_service_1 = require("../../services/interview/interviewRound.service");
const interviewRound_repository_1 = require("../../repositories/interview/interviewRound.repository");
const interviewFeedback_controller_1 = require("../../controllers/interview/interviewFeedback.controller");
const interviewFeedback_service_1 = require("../../services/interview/interviewFeedback.service");
const interviewFeedback_repository_1 = require("../../repositories/interview/interviewFeedback.repository");
const router = (0, express_1.Router)();
exports.interviewRoutes = router;
// Dependencies
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
const interviewRepo = new interview_repository_1.InterviewRepository();
const interviewMapper = new interview_mapper_1.InterviewMapper();
//Service with dependency
const interviewService = new interview_service_1.InterviewService(interviewRepo, interviewMapper);
//Controller
const roundRepo = new interviewRound_repository_1.InterviewRoundRepository();
const roundService = new interviewRound_service_1.InterviewRoundService(roundRepo, interviewRepo, notificationAdapter);
const roundController = new interviewRound_controller_1.InterviewRoundController(roundService);
const feedbackRepo = new interviewFeedback_repository_1.InterviewFeedbackRepository();
const feedbackService = new interviewFeedback_service_1.InterviewFeedbackService(feedbackRepo, roundRepo, notificationAdapter);
const feedbackController = new interviewFeedback_controller_1.InterviewFeedbackController(feedbackService);
//Interview routes
const candidateInterviewController = new interviewCandidate_controller_1.CandidateInterviewController(interviewService);
const employerInterviewController = new interviewEmployer_controller_1.EmployerInterviewController(interviewService);
router.get("/candidate", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), candidateInterviewController.getMyInterviews.bind(candidateInterviewController));
router.get("/employer", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), employerInterviewController.getInterviews.bind(employerInterviewController));
router.patch("/employer/:id/status", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), employerInterviewController.updateInterviewStatus.bind(employerInterviewController));
router.post("/rounds", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.createRound.bind(roundController));
router.get("/rounds/employer", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.getEmployerRounds.bind(roundController));
router.get("/rounds/candidate", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), roundController.getMyRounds.bind(roundController));
router.get("/rounds/application/:applicationId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), roundController.getRoundsForApplication.bind(roundController));
router.get("/rounds/:id", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), roundController.getRoundById.bind(roundController));
router.patch("/rounds/:id/status", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.updateRoundStatus.bind(roundController));
router.patch("/rounds/:id/reschedule", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.rescheduleRound.bind(roundController));
router.patch("/rounds/:id/cancel", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.cancelRound.bind(roundController));
router.get("/rounds/:roundId/validate/:token", roundController.validateMeetingAccess.bind(roundController));
router.post("/rounds/:roundId/feedback", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.submitFeedback.bind(feedbackController));
router.get("/rounds/:roundId/feedback", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.getFeedbackForRound.bind(feedbackController));
router.get("/rounds/:roundId/feedback/candidate", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), feedbackController.getSharedFeedbackForRound.bind(feedbackController));
router.get("/rounds/feedback/application/:applicationId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.getFeedbackForApplication.bind(feedbackController));
router.get("/rounds/:roundId/feedback/summary", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.getFeedbackSummary.bind(feedbackController));
router.patch("/feedback/:id/share", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.shareFeedbackWithCandidate.bind(feedbackController));
//# sourceMappingURL=interview.routes.js.map