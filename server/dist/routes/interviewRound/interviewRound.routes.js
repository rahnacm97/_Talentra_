"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewRoundRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const interviewRound_controller_1 = require("../../controllers/interview/interviewRound.controller");
const interviewRound_service_1 = require("../../services/interview/interviewRound.service");
const interviewRound_repository_1 = require("../../repositories/interview/interviewRound.repository");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
const NotificationAdapter_1 = require("../../services/notification/NotificationAdapter");
const router = (0, express_1.Router)();
exports.interviewRoundRouter = router;
// Dependencies
const roundRepo = new interviewRound_repository_1.InterviewRoundRepository();
const interviewRepo = new interview_repository_1.InterviewRepository();
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
const roundService = new interviewRound_service_1.InterviewRoundService(roundRepo, interviewRepo, notificationAdapter);
const roundController = new interviewRound_controller_1.InterviewRoundController(roundService);
// Employer routes - Create and manage rounds
router.post("/", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.createRound.bind(roundController));
router.get("/employer", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.getEmployerRounds.bind(roundController));
// Candidate routes - View their rounds
router.get("/candidate", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE]), roundController.getMyRounds.bind(roundController));
// Shared routes - Both can access
router.get("/application/:applicationId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), roundController.getRoundsForApplication.bind(roundController));
router.get("/:id", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), roundController.getRoundById.bind(roundController));
// Employer-only management routes
router.patch("/:id/status", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.updateRoundStatus.bind(roundController));
router.patch("/:id/reschedule", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.rescheduleRound.bind(roundController));
router.patch("/:id/cancel", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), roundController.cancelRound.bind(roundController));
// Public route for meeting link validation (with token)
router.get("/:roundId/validate/:token", roundController.validateMeetingAccess.bind(roundController));
//# sourceMappingURL=interviewRound.routes.js.map