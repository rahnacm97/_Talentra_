"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallController = void 0;
const video_call_service_1 = require("../../services/video-call/video-call.service");
const video_call_repository_1 = require("../../repositories/video-call/video-call.repository");
const notification_repository_1 = require("../../repositories/notification/notification.repository");
const notification_service_1 = require("../../services/notification/notification.service");
const videoCallRepo = new video_call_repository_1.VideoCallRepository();
const notificationRepo = new notification_repository_1.NotificationRepository();
const notificationService = new notification_service_1.NotificationService(notificationRepo);
const videoCallService = new video_call_service_1.VideoCallService(videoCallRepo, notificationService);
class VideoCallController {
    // Create video call for an interview
    async createVideoCall(req, res, next) {
        try {
            const { interviewId, participants } = req.body;
            const videoCall = await videoCallService.createVideoCall({
                interviewId,
                participants,
            });
            res.json({ success: true, data: videoCall });
        }
        catch (error) {
            next(error);
        }
    }
    // Get video call by room ID
    async getVideoCall(req, res, next) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return res.status(400).json({ success: false, message: 'Room ID is required' });
            }
            const videoCall = await videoCallService.getVideoCallByRoomId(roomId);
            if (!videoCall) {
                return res.status(404).json({ success: false, message: 'Video call not found' });
            }
            res.json({ success: true, data: videoCall });
        }
        catch (error) {
            next(error);
        }
    }
    // Get video call by interview ID
    async getVideoCallByInterview(req, res, next) {
        try {
            const { interviewId } = req.params;
            if (!interviewId) {
                return res.status(400).json({ success: false, message: 'Interview ID is required' });
            }
            const videoCall = await videoCallService.getVideoCallByInterviewId(interviewId);
            if (!videoCall) {
                return res.status(404).json({ success: false, message: 'Video call not found' });
            }
            res.json({ success: true, data: videoCall });
        }
        catch (error) {
            next(error);
        }
    }
    // Join video call (log participant)
    async joinCall(req, res, next) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return res.status(400).json({ success: false, message: 'Room ID is required' });
            }
            const userId = req.user.id;
            await videoCallService.joinCall(roomId, userId);
            res.json({ success: true, message: 'Joined video call' });
        }
        catch (error) {
            next(error);
        }
    }
    // Leave video call
    async leaveCall(req, res, next) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return res.status(400).json({ success: false, message: 'Room ID is required' });
            }
            const userId = req.user.id;
            await videoCallService.leaveCall(roomId, userId);
            res.json({ success: true, message: 'Left video call' });
        }
        catch (error) {
            next(error);
        }
    }
    // End video call
    async endCall(req, res, next) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return res.status(400).json({ success: false, message: 'Room ID is required' });
            }
            await videoCallService.endCall(roomId);
            res.json({ success: true, message: 'Video call ended' });
        }
        catch (error) {
            next(error);
        }
    }
    // Cancel video call
    async cancelCall(req, res, next) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return res.status(400).json({ success: false, message: 'Room ID is required' });
            }
            await videoCallService.cancelCall(roomId);
            res.json({ success: true, message: 'Video call cancelled' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.VideoCallController = VideoCallController;
exports.default = new VideoCallController();
//# sourceMappingURL=video-call.controller.js.map