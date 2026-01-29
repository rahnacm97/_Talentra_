"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewParticipantRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const interviewParticipant_controller_1 = require("../../controllers/interview/interviewParticipant.controller");
const interviewParticipant_service_1 = require("../../services/interview/interviewParticipant.service");
const interviewParticipant_repository_1 = require("../../repositories/interview/interviewParticipant.repository");
const router = (0, express_1.Router)();
exports.interviewParticipantRouter = router;
// Dependencies
const participantRepo = new interviewParticipant_repository_1.InterviewParticipantRepository();
const participantService = new interviewParticipant_service_1.InterviewParticipantService(participantRepo);
const participantController = new interviewParticipant_controller_1.InterviewParticipantController(participantService);
// Add participant (employer only)
router.post("/:roundId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), participantController.addParticipant.bind(participantController));
// Get participants (both roles)
router.get("/:roundId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), participantController.getParticipants.bind(participantController));
// Update participant status (employer only)
router.patch("/:roundId/:userId/status", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), participantController.updateParticipantStatus.bind(participantController));
// Record join (authenticated user)
router.post("/:roundId/join", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), participantController.recordJoin.bind(participantController));
// Record leave (authenticated user)
router.post("/:roundId/leave", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE]), participantController.recordLeave.bind(participantController));
// Remove participant (employer only)
router.delete("/:roundId/:userId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), participantController.removeParticipant.bind(participantController));
//# sourceMappingURL=interviewParticipant.routes.js.map