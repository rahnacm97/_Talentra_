"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewRoomHandler = exports.InterviewRoomHandler = void 0;
const logger_1 = require("../../shared/utils/logger");
class InterviewRoomHandler {
    constructor() {
        this.rooms = new Map();
        this.io = null;
    }
    initialize(io) {
        this.io = io;
        logger_1.logger.info("InterviewRoomHandler initialized");
    }
    handleConnection(socket) {
        // Join interview room
        socket.on("join_interview_room", async (data) => {
            try {
                const { roomId, userId, userInfo } = data;
                // Get or create room state
                if (!this.rooms.has(roomId)) {
                    this.rooms.set(roomId, {
                        roomId,
                        participants: new Map(),
                        maxParticipants: 6,
                    });
                }
                const room = this.rooms.get(roomId);
                // Check participant limit
                if (room.participants.size >= room.maxParticipants) {
                    socket.emit("room_full", {
                        maxParticipants: room.maxParticipants,
                    });
                    logger_1.logger.warn("Room full", { roomId, userId });
                    return;
                }
                // Add participant to room
                const participant = {
                    userId,
                    socketId: socket.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    role: userInfo.role,
                };
                room.participants.set(userId, participant);
                socket.join(roomId);
                logger_1.logger.info("User joined interview room", {
                    roomId,
                    userId,
                    participantCount: room.participants.size,
                });
                // Notify existing participants about new participant
                socket.to(roomId).emit("room_participant_joined", {
                    userId,
                    userInfo: {
                        name: userInfo.name,
                        email: userInfo.email,
                        role: userInfo.role,
                    },
                });
                // Send current participants list to new participant
                const currentParticipants = Array.from(room.participants.values())
                    .filter((p) => p.userId !== userId)
                    .map((p) => ({
                    userId: p.userId,
                    name: p.name,
                    email: p.email,
                    role: p.role,
                }));
                socket.emit("room_participants_list", {
                    participants: currentParticipants,
                });
            }
            catch (error) {
                logger_1.logger.error("Error joining interview room", { error });
                socket.emit("error", { message: "Failed to join room" });
            }
        });
        // Leave interview room
        socket.on("leave_interview_room", (data) => {
            this.handleLeaveRoom(socket, data.roomId, data.userId);
        });
        // WebRTC signaling - Offer
        socket.on("webrtc_offer", (data) => {
            const { roomId, offer, targetUserId, userInfo } = data;
            const room = this.rooms.get(roomId);
            if (!room) {
                logger_1.logger.warn("Room not found for offer", { roomId });
                return;
            }
            const targetParticipant = room.participants.get(targetUserId);
            if (!targetParticipant) {
                logger_1.logger.warn("Target participant not found", { targetUserId });
                return;
            }
            // Get sender info
            const senderUserId = Array.from(room.participants.values()).find((p) => p.socketId === socket.id)?.userId;
            logger_1.logger.info("Relaying WebRTC offer", {
                roomId,
                from: senderUserId,
                to: targetUserId,
            });
            this.io.to(targetParticipant.socketId).emit("webrtc_offer_received", {
                fromUserId: senderUserId,
                offer,
                userInfo,
            });
        });
        // WebRTC signaling - Answer
        socket.on("webrtc_answer", (data) => {
            const { roomId, answer, targetUserId } = data;
            const room = this.rooms.get(roomId);
            if (!room) {
                logger_1.logger.warn("Room not found for answer", { roomId });
                return;
            }
            const targetParticipant = room.participants.get(targetUserId);
            if (!targetParticipant) {
                logger_1.logger.warn("Target participant not found", { targetUserId });
                return;
            }
            const senderUserId = Array.from(room.participants.values()).find((p) => p.socketId === socket.id)?.userId;
            logger_1.logger.info("Relaying WebRTC answer", {
                roomId,
                from: senderUserId,
                to: targetUserId,
            });
            this.io.to(targetParticipant.socketId).emit("webrtc_answer_received", {
                fromUserId: senderUserId,
                answer,
            });
        });
        // WebRTC signaling - ICE Candidate
        socket.on("webrtc_ice_candidate", (data) => {
            const { roomId, candidate, targetUserId } = data;
            const room = this.rooms.get(roomId);
            if (!room) {
                return;
            }
            const targetParticipant = room.participants.get(targetUserId);
            if (!targetParticipant) {
                return;
            }
            const senderUserId = Array.from(room.participants.values()).find((p) => p.socketId === socket.id)?.userId;
            this.io.to(targetParticipant.socketId).emit("webrtc_ice_candidate_received", {
                fromUserId: senderUserId,
                candidate,
            });
        });
        // Handle disconnect
        socket.on("disconnect", () => {
            // Find and remove participant from all rooms
            for (const [roomId, room] of this.rooms.entries()) {
                const participant = Array.from(room.participants.values()).find((p) => p.socketId === socket.id);
                if (participant) {
                    this.handleLeaveRoom(socket, roomId, participant.userId);
                }
            }
        });
    }
    handleLeaveRoom(socket, roomId, userId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.participants.delete(userId);
        socket.leave(roomId);
        logger_1.logger.info("User left interview room", {
            roomId,
            userId,
            remainingParticipants: room.participants.size,
        });
        // Notify other participants
        socket.to(roomId).emit("room_participant_left", { userId });
        // Clean up empty rooms
        if (room.participants.size === 0) {
            this.rooms.delete(roomId);
            logger_1.logger.info("Room cleaned up", { roomId });
        }
    }
    getRoomState(roomId) {
        return this.rooms.get(roomId);
    }
    getParticipantCount(roomId) {
        const room = this.rooms.get(roomId);
        return room ? room.participants.size : 0;
    }
}
exports.InterviewRoomHandler = InterviewRoomHandler;
exports.interviewRoomHandler = new InterviewRoomHandler();
//# sourceMappingURL=interviewRoom.handler.js.map