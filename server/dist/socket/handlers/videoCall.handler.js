"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallHandler = void 0;
class VideoCallHandler {
    constructor(_videoCallService) {
        this._videoCallService = _videoCallService;
        this.roomHosts = new Map();
    }
    handle(socket) {
        this.initializeEvents(socket);
    }
    initializeEvents(socket) {
        socket.on("join_call", (data) => this.handleJoinCall(socket, data));
        socket.on("request_to_join", (data) => this.handleRequestToJoin(socket, data));
        socket.on("admit_participant", (data) => this.handleAdmitParticipant(socket, data));
        socket.on("deny_participant", (data) => this.handleDenyParticipant(socket, data));
        socket.on("offer", (data) => this.handleOffer(socket, data));
        socket.on("answer", (data) => this.handleAnswer(socket, data));
        socket.on("ice_candidate", (data) => this.handleIceCandidate(socket, data));
        socket.on("end_call", (data) => this.handleEndCall(socket, data));
        socket.on("group_message", (data) => this.handleGroupMessage(socket, data));
    }
    async handleJoinCall(socket, data) {
        const { roomId, userId, isHost } = data;
        socket.join(roomId);
        if (isHost || !this.roomHosts.has(roomId)) {
            console.log(`Setting host for room ${roomId}: ${socket.id}`);
            this.roomHosts.set(roomId, socket.id);
        }
        console.log(`User ${userId} joined room ${roomId} (Host: ${isHost})`);
        socket.to(roomId).emit("user_joined", userId);
    }
    handleRequestToJoin(socket, data) {
        console.log(`Request to join room ${data.roomId} from ${data.userId} (${data.name})`);
        const hostSocketId = this.roomHosts.get(data.roomId);
        console.log(`Host socket ID for room ${data.roomId}: ${hostSocketId}`);
        if (hostSocketId) {
            console.log(`Emitting participant_waiting to host ${hostSocketId}`);
            socket.to(hostSocketId).emit("participant_waiting", {
                socketId: socket.id,
                userId: data.userId,
                name: data.name,
                userType: data.userType,
            });
        }
        else {
            console.log(`No host found for room ${data.roomId}`);
        }
    }
    handleAdmitParticipant(socket, data) {
        socket.to(data.socketId).emit("participant_admitted", {
            roomId: data.roomId,
        });
    }
    handleDenyParticipant(socket, data) {
        socket.to(data.socketId).emit("participant_denied", {
            roomId: data.roomId,
        });
    }
    handleOffer(socket, data) {
        const fromUserId = socket.data.userId;
        const targetedData = { ...data, fromUserId };
        if (data.targetUserId) {
            socket.to(data.targetUserId).emit("offer", targetedData);
        }
        else {
            socket.to(data.roomId).emit("offer", targetedData);
        }
    }
    handleAnswer(socket, data) {
        const fromUserId = socket.data.userId;
        const targetedData = { ...data, fromUserId };
        if (data.targetUserId) {
            socket.to(data.targetUserId).emit("answer", targetedData);
        }
        else {
            socket.to(data.roomId).emit("answer", targetedData);
        }
    }
    handleIceCandidate(socket, data) {
        const fromUserId = socket.data.userId;
        const targetedData = { ...data, fromUserId };
        if (data.targetUserId) {
            socket.to(data.targetUserId).emit("ice_candidate", targetedData);
        }
        else {
            socket.to(data.roomId).emit("ice_candidate", targetedData);
        }
    }
    async handleEndCall(socket, data) {
        const { roomId, userId } = data;
        socket.to(roomId).emit("call_ended", { userId });
        socket.leave(roomId);
        if (this.roomHosts.get(roomId) === socket.id) {
            this.roomHosts.delete(roomId);
        }
        try {
            await this._videoCallService.endCall(roomId);
        }
        catch (error) {
            console.error("Error logging call end:", error);
        }
    }
    handleGroupMessage(socket, data) {
        socket.to(data.roomId).emit("new_message", {
            sender: data.sender,
            message: data.message,
            timestamp: new Date(),
        });
    }
}
exports.VideoCallHandler = VideoCallHandler;
//# sourceMappingURL=videoCall.handler.js.map