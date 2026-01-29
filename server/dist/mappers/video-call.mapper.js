"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallMapper = void 0;
class VideoCallMapper {
    static toVideoCallResponseDTO(videoCall) {
        return {
            id: videoCall._id.toString(),
            interviewId: videoCall.interviewId.toString(),
            roomId: videoCall.roomId,
            participants: videoCall.participants.map((p) => ({
                userId: p.userId._id?.toString() || p.userId.toString(),
                role: p.role,
                name: p.userId.companyName
                    ? p.userId.companyName
                    : p.userId.firstName
                        ? `${p.userId.firstName} ${p.userId.lastName}`
                        : 'User',
                joinedAt: p.joinedAt,
                leftAt: p.leftAt,
            })),
            maxParticipants: videoCall.maxParticipants,
            status: videoCall.status,
            startedAt: videoCall.startedAt,
            endedAt: videoCall.endedAt,
            duration: videoCall.duration,
            createdAt: videoCall.createdAt,
        };
    }
}
exports.VideoCallMapper = VideoCallMapper;
//# sourceMappingURL=video-call.mapper.js.map