"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupVideoCallHandlers = setupVideoCallHandlers;
const socket_types_1 = require("../types/socket.types");
function setupVideoCallHandlers(io, socket, videoCallService) {
    const user = socket.data.user;
    // Join video call room
    socket.on(socket_types_1.SocketEvents.VIDEO_JOIN, async (payload) => {
        try {
            const { roomId, userName } = payload;
            const roomName = socket_types_1.getRoomName.videoCall(roomId);
            // Verify user is participant and join call in database
            await videoCallService.joinCall(roomId, user.userId);
            // Join Socket.IO room
            socket.join(roomName);
            // Get current participants in the room
            const socketsInRoom = await io.in(roomName).fetchSockets();
            // Check max participants (3)
            if (socketsInRoom.length > 3) {
                socket.emit('error', { message: 'Maximum 3 participants allowed' });
                socket.leave(roomName);
                return;
            }
            console.log(`📹 User ${user.email} joined video call: ${roomId}`);
            // Notify others in the room that a new user joined
            socket.to(roomName).emit(socket_types_1.SocketEvents.VIDEO_USER_JOINED, {
                userId: user.userId,
                userName: userName || user.email,
                socketId: socket.id,
            });
            // Send list of existing participants to the new user
            const existingParticipants = socketsInRoom
                .filter(s => s.id !== socket.id)
                .map(s => ({
                userId: s.data.user.userId,
                userName: s.data.user.email,
                socketId: s.id,
            }));
            socket.emit('existing-participants', existingParticipants);
        }
        catch (error) {
            console.error('Error joining video call:', error);
            socket.emit('error', { message: 'Failed to join video call' });
        }
    });
    // WebRTC Offer
    socket.on(socket_types_1.SocketEvents.VIDEO_OFFER, (payload) => {
        const { roomId, targetUserId, offer } = payload;
        const roomName = socket_types_1.getRoomName.videoCall(roomId);
        // Forward offer to target user
        socket.to(roomName).emit(socket_types_1.SocketEvents.VIDEO_OFFER, {
            offer,
            fromUserId: user.userId,
            fromSocketId: socket.id,
        });
    });
    // WebRTC Answer
    socket.on(socket_types_1.SocketEvents.VIDEO_ANSWER, (payload) => {
        const { roomId, targetUserId, answer } = payload;
        const roomName = socket_types_1.getRoomName.videoCall(roomId);
        // Forward answer to target user
        socket.to(roomName).emit(socket_types_1.SocketEvents.VIDEO_ANSWER, {
            answer,
            fromUserId: user.userId,
            fromSocketId: socket.id,
        });
    });
    // ICE Candidate
    socket.on(socket_types_1.SocketEvents.VIDEO_ICE_CANDIDATE, (payload) => {
        const { roomId, targetUserId, candidate } = payload;
        const roomName = socket_types_1.getRoomName.videoCall(roomId);
        // Forward ICE candidate to target user
        socket.to(roomName).emit(socket_types_1.SocketEvents.VIDEO_ICE_CANDIDATE, {
            candidate,
            fromUserId: user.userId,
            fromSocketId: socket.id,
        });
    });
    // Leave video call
    socket.on(socket_types_1.SocketEvents.VIDEO_LEAVE, async (payload) => {
        try {
            const { roomId } = payload;
            const roomName = socket_types_1.getRoomName.videoCall(roomId);
            // Update database
            await videoCallService.leaveCall(roomId, user.userId);
            // Notify others in the room
            socket.to(roomName).emit(socket_types_1.SocketEvents.VIDEO_USER_LEFT, {
                userId: user.userId,
                socketId: socket.id,
            });
            // Leave Socket.IO room
            socket.leave(roomName);
            console.log(`📹 User ${user.email} left video call: ${roomId}`);
        }
        catch (error) {
            console.error('Error leaving video call:', error);
        }
    });
    // Handle disconnect (auto-leave all video calls)
    socket.on(socket_types_1.SocketEvents.DISCONNECT, async () => {
        // Find all video call rooms this socket was in
        const rooms = Array.from(socket.rooms).filter(room => room.startsWith('video:'));
        for (const roomName of rooms) {
            const roomId = roomName.replace('video:', '');
            try {
                await videoCallService.leaveCall(roomId, user.userId);
                // Notify others
                socket.to(roomName).emit(socket_types_1.SocketEvents.VIDEO_USER_LEFT, {
                    userId: user.userId,
                    socketId: socket.id,
                });
            }
            catch (error) {
                console.error('Error auto-leaving video call on disconnect:', error);
            }
        }
    });
}
//# sourceMappingURL=video-call.socket.js.map