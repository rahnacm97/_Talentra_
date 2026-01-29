"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallRepository = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const video_call_model_1 = require("../../models/video-call.model");
class VideoCallRepository {
    async createVideoCall(data) {
        const videoCall = new video_call_model_1.VideoCall({
            interviewId: new mongoose_1.Types.ObjectId(data.interviewId),
            roomId: `room-${(0, uuid_1.v4)()}`,
            participants: data.participants.map(p => ({
                userId: new mongoose_1.Types.ObjectId(p.userId),
                role: p.role,
            })),
            maxParticipants: 3,
            status: 'scheduled',
        });
        return await videoCall.save();
    }
    async findByRoomId(roomId) {
        return await video_call_model_1.VideoCall.findOne({ roomId })
            .populate('participants.userId', 'firstName lastName companyName email')
            .exec();
    }
    async findByInterviewId(interviewId) {
        return await video_call_model_1.VideoCall.findOne({ interviewId: new mongoose_1.Types.ObjectId(interviewId) })
            .populate('participants.userId', 'firstName lastName companyName email')
            .exec();
    }
    async updateParticipantStatus(roomId, userId, status) {
        const videoCall = await video_call_model_1.VideoCall.findOne({ roomId });
        if (!videoCall)
            return;
        const participant = videoCall.participants.find(p => p.userId.toString() === userId);
        if (participant) {
            if (status === 'joined') {
                participant.joinedAt = new Date();
            }
            else {
                participant.leftAt = new Date();
            }
            await videoCall.save();
        }
    }
    async startCall(roomId) {
        await video_call_model_1.VideoCall.findOneAndUpdate({ roomId }, {
            status: 'ongoing',
            startedAt: new Date(),
        });
    }
    async endCall(roomId) {
        await video_call_model_1.VideoCall.findOneAndUpdate({ roomId }, {
            status: 'completed',
            endedAt: new Date(),
        });
    }
    async cancelCall(roomId) {
        await video_call_model_1.VideoCall.findOneAndUpdate({ roomId }, { status: 'cancelled' });
    }
    async findById(videoCallId) {
        return await video_call_model_1.VideoCall.findById(videoCallId)
            .populate('participants.userId', 'firstName lastName companyName email')
            .exec();
    }
}
exports.VideoCallRepository = VideoCallRepository;
//# sourceMappingURL=video-call.repository.js.map