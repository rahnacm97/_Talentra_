"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interviewRound_controller_1 = require("../controllers/interview/interviewRound.controller");
const interviewRound_service_1 = require("../services/interview/interviewRound.service");
const interviewRound_repository_1 = require("../repositories/interview/interviewRound.repository");
const interviewRound_mapper_1 = require("../mappers/interview/interviewRound.mapper");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Initialize dependencies
const repository = new interviewRound_repository_1.InterviewRoundRepository();
const service = new interviewRound_service_1.InterviewRoundService(repository);
const mapper = new interviewRound_mapper_1.InterviewRoundMapper();
const controller = new interviewRound_controller_1.InterviewRoundController(service, mapper);
// All routes require authentication
router.use(authMiddleware_1.authenticateToken);
// Interview-based routes (create rounds for an interview)
router.post("/interviews/:interviewId/rounds", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.createRound.bind(controller));
router.post("/interviews/:interviewId/rounds/bulk", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.createMultipleRounds.bind(controller));
router.get("/interviews/:interviewId/rounds", controller.getRoundsByInterview.bind(controller));
// Application-based routes
router.get("/applications/:applicationId/rounds", controller.getRoundsByApplication.bind(controller));
// Round-specific routes
router.get("/rounds", controller.getRoundsWithPagination.bind(controller));
router.get("/rounds/:roundId", controller.getRoundById.bind(controller));
router.get("/rounds/room/:roomId", controller.getRoundByRoomId.bind(controller));
router.patch("/rounds/:roundId", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.updateRound.bind(controller));
router.patch("/rounds/:roundId/schedule", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.scheduleRound.bind(controller));
router.patch("/rounds/:roundId/reschedule", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.rescheduleRound.bind(controller));
router.patch("/rounds/:roundId/cancel", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.cancelRound.bind(controller));
router.patch("/rounds/:roundId/start", controller.startRound.bind(controller));
router.patch("/rounds/:roundId/complete", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.completeRound.bind(controller));
// Feedback routes
router.post("/rounds/:roundId/feedback", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.submitFeedback.bind(controller));
router.get("/rounds/:roundId/feedback/summary", controller.getFeedbackSummary.bind(controller));
// Participant management routes
router.post("/rounds/:roundId/participants", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.addParticipant.bind(controller));
router.delete("/rounds/:roundId/participants/:userId", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.removeParticipant.bind(controller));
router.patch("/rounds/:roundId/participants/:userId/role", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.updateParticipantRole.bind(controller));
// Utility routes
router.get("/rounds/:roundId/validate-access", controller.validateAccess.bind(controller));
router.delete("/rounds/:roundId", (0, authMiddleware_1.authorizeRoles)("Employer"), controller.deleteRound.bind(controller));
exports.default = router;
//# sourceMappingURL=interviewRound.routes.js.map