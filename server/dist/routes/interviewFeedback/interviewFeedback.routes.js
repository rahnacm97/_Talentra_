"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewFeedbackRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const interviewFeedback_controller_1 = require("../../controllers/interview/interviewFeedback.controller");
const interviewFeedback_service_1 = require("../../services/interview/interviewFeedback.service");
const interviewFeedback_repository_1 = require("../../repositories/interview/interviewFeedback.repository");
const interviewRound_repository_1 = require("../../repositories/interview/interviewRound.repository");
const NotificationAdapter_1 = require("../../services/notification/NotificationAdapter");
const router = (0, express_1.Router)();
exports.interviewFeedbackRouter = router;
// Dependencies
const feedbackRepo = new interviewFeedback_repository_1.InterviewFeedbackRepository();
const roundRepo = new interviewRound_repository_1.InterviewRoundRepository();
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
const feedbackService = new interviewFeedback_service_1.InterviewFeedbackService(feedbackRepo, roundRepo, notificationAdapter);
const feedbackController = new interviewFeedback_controller_1.InterviewFeedbackController(feedbackService);
// Submit feedback (employer only)
router.post("/:roundId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.submitFeedback.bind(feedbackController));
// Get feedback for round (employer only)
router.get("/round/:roundId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.getFeedbackForRound.bind(feedbackController));
// Get shared feedback for round (candidate accessible)
router.get("/candidate/round/:roundId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE, enums_1.USER_ROLES.EMPLOYER]), feedbackController.getSharedFeedbackForRound.bind(feedbackController));
// Get feedback for application (employer only)
router.get("/application/:applicationId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.getFeedbackForApplication.bind(feedbackController));
// Get feedback summary (employer only)
router.get("/round/:roundId/summary", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.getFeedbackSummary.bind(feedbackController));
// Update feedback (employer only)
router.patch("/:id", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.updateFeedback.bind(feedbackController));
// Share feedback with candidate (employer only)
router.patch("/:id/share", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), feedbackController.shareFeedbackWithCandidate.bind(feedbackController));
//# sourceMappingURL=interviewFeedback.routes.js.map