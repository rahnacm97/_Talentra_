"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallService = void 0;
const video_call_mapper_1 = require("../../mappers/video-call.mapper");
class VideoCallService {
    constructor(videoCallRepository, notificationService) {
        this.videoCallRepository = videoCallRepository;
        this.notificationService = notificationService;
    }
    async createVideoCall(data) {
        // Validate max participants (3)
        if (data.participants.length > 3) {
            throw new Error('Maximum 3 participants allowed in a video call');
        }
        const videoCall = await this.videoCallRepository.createVideoCall(data);
        return video_call_mapper_1.VideoCallMapper.toVideoCallResponseDTO(videoCall);
    }
    async getVideoCallByRoomId(roomId) {
        const videoCall = await this.videoCallRepository.findByRoomId(roomId);
        if (!videoCall)
            return null;
        return video_call_mapper_1.VideoCallMapper.toVideoCallResponseDTO(videoCall);
    }
    async getVideoCallByInterviewId(interviewId) {
        const videoCall = await this.videoCallRepository.findByInterviewId(interviewId);
        if (!videoCall)
            return null;
        return video_call_mapper_1.VideoCallMapper.toVideoCallResponseDTO(videoCall);
    }
    async joinCall(roomId, userId) {
        const videoCall = await this.videoCallRepository.findByRoomId(roomId);
        if (!videoCall) {
            throw new Error('Video call not found');
        }
        // Check if user is a participant
        const isParticipant = videoCall.participants.some(p => p.userId.toString() === userId);
        if (!isParticipant) {
            throw new Error('User is not a participant of this video call');
        }
        // Update participant status
        await this.videoCallRepository.updateParticipantStatus(roomId, userId, 'joined');
        // If this is the first participant, start the call
        const activeParticipants = videoCall.participants.filter(p => p.joinedAt && !p.leftAt);
        if (activeParticipants.length === 0) {
            await this.startCall(roomId);
        }
    }
    async leaveCall(roomId, userId) {
        await this.videoCallRepository.updateParticipantStatus(roomId, userId, 'left');
        // Check if all participants have left
        const videoCall = await this.videoCallRepository.findByRoomId(roomId);
        if (videoCall) {
            const activeParticipants = videoCall.participants.filter(p => p.joinedAt && !p.leftAt);
            // If no active participants, end the call
            if (activeParticipants.length === 0) {
                await this.endCall(roomId);
            }
        }
    }
    async startCall(roomId) {
        await this.videoCallRepository.startCall(roomId);
        // Send notifications to all participants
        const videoCall = await this.videoCallRepository.findByRoomId(roomId);
        if (videoCall) {
            await this.notificationService.sendVideoCallNotification(videoCall.participants.map(p => ({
                userId: p.userId.toString(),
                role: p.role,
            })), roomId, 'started');
        }
    }
    async endCall(roomId) {
        await this.videoCallRepository.endCall(roomId);
        // Send notifications to all participants
        const videoCall = await this.videoCallRepository.findByRoomId(roomId);
        if (videoCall) {
            await this.notificationService.sendVideoCallNotification(videoCall.participants.map(p => ({
                userId: p.userId.toString(),
                role: p.role,
            })), roomId, 'ended');
        }
    }
    async cancelCall(roomId) {
        await this.videoCallRepository.cancelCall(roomId);
    }
}
exports.VideoCallService = VideoCallService;
//# sourceMappingURL=video-call.service.js.map