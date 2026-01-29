"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_call_controller_1 = __importDefault(require("../../controllers/video-call/video-call.controller"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const router = (0, express_1.Router)();
// All routes require authentication
router.use((0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE, enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.ADMIN]));
// Create video call
router.post('/', video_call_controller_1.default.createVideoCall.bind(video_call_controller_1.default));
// Get video call by room ID
router.get('/:roomId', video_call_controller_1.default.getVideoCall.bind(video_call_controller_1.default));
// Get video call by interview ID
router.get('/interview/:interviewId', video_call_controller_1.default.getVideoCallByInterview.bind(video_call_controller_1.default));
// Join video call
router.post('/:roomId/join', video_call_controller_1.default.joinCall.bind(video_call_controller_1.default));
// Leave video call
router.post('/:roomId/leave', video_call_controller_1.default.leaveCall.bind(video_call_controller_1.default));
// End video call
router.post('/:roomId/end', video_call_controller_1.default.endCall.bind(video_call_controller_1.default));
// Cancel video call
router.post('/:roomId/cancel', video_call_controller_1.default.cancelCall.bind(video_call_controller_1.default));
exports.default = router;
//# sourceMappingURL=video-call.routes.js.map