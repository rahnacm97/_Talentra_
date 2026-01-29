"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatHandlers = setupChatHandlers;
const socket_types_1 = require("../types/socket.types");
function setupChatHandlers(io, socket, chatService, notificationService) {
    const user = socket.data.user;
    // Track joined rooms to prevent duplicates
    if (!socket.data.joinedRooms) {
        socket.data.joinedRooms = new Set();
    }
    // Join a conversation room
    socket.on(socket_types_1.SocketEvents.CHAT_JOIN, async (payload) => {
        try {
            const { conversationId } = payload;
            const roomName = socket_types_1.getRoomName.conversation(conversationId);
            // Prevent duplicate joins
            if (socket.data.joinedRooms.has(roomName)) {
                console.log(`⚠️  User ${user.email} already in conversation: ${conversationId}`);
                return;
            }
            // Validate user is a participant in this conversation
            const conversation = await chatService.getConversationById(conversationId);
            if (!conversation) {
                console.error(`❌ Conversation ${conversationId} not found`);
                socket.emit('error', { message: 'Conversation not found' });
                return;
            }
            // Check if user is actually a participant
            const isEmployerParticipant = conversation.participants.employer.id === user.userId;
            const isCandidateParticipant = conversation.participants.candidate.id === user.userId;
            if (!isEmployerParticipant && !isCandidateParticipant) {
                console.error(`❌ User ${user.email} (${user.userId}) attempted to join conversation ${conversationId} without permission`);
                socket.emit('error', { message: 'You are not a participant in this conversation' });
                return;
            }
            // Join the room
            socket.join(roomName);
            socket.data.joinedRooms.add(roomName);
            console.log(`📨 User ${user.email} (${user.role}) joined conversation: ${conversationId}`);
            // Mark messages as read when joining
            await chatService.markMessagesAsRead(conversationId, user.userId, user.role);
        }
        catch (error) {
            console.error('Error joining chat:', error);
            socket.emit('error', { message: 'Failed to join conversation' });
        }
    });
    // Leave a conversation room
    socket.on(socket_types_1.SocketEvents.CHAT_LEAVE, (payload) => {
        const { conversationId } = payload;
        const roomName = socket_types_1.getRoomName.conversation(conversationId);
        if (socket.data.joinedRooms?.has(roomName)) {
            socket.leave(roomName);
            socket.data.joinedRooms.delete(roomName);
            console.log(`📭 User ${user.email} (${user.role}) left conversation: ${conversationId}`);
        }
        else {
            console.log(`⚠️  User ${user.email} tried to leave conversation they weren't in: ${conversationId}`);
        }
    });
    // Send a message
    socket.on(socket_types_1.SocketEvents.CHAT_MESSAGE, async (payload) => {
        try {
            const { conversationId, content, type, metadata } = payload;
            // Save message to database
            const message = await chatService.sendMessage({
                conversationId,
                senderId: user.userId,
                senderRole: user.role,
                content,
                type,
                ...(metadata && { metadata }),
            });
            // Emit message to all users in the conversation room
            const roomName = socket_types_1.getRoomName.conversation(conversationId);
            const socketsInRoom = await io.in(roomName).fetchSockets();
            console.log(`💬 User ${user.email} (${user.role}) sent message to room ${roomName} (${socketsInRoom.length} sockets)`);
            io.to(roomName).emit(socket_types_1.SocketEvents.CHAT_MESSAGE_RECEIVED, message);
            // Get conversation to find recipient
            const conversation = await chatService.getConversations(user.userId, user.role);
            const currentConversation = conversation.find(c => c.id === conversationId);
            if (currentConversation) {
                const recipientRole = user.role === 'employer' ? 'candidate' : 'employer';
                const recipientId = recipientRole === 'employer'
                    ? currentConversation.participants.employer.id
                    : currentConversation.participants.candidate.id;
                // Send notification to recipient
                const senderName = user.role === 'employer'
                    ? currentConversation.participants.employer.name
                    : currentConversation.participants.candidate.name;
                await notificationService.sendChatNotification(recipientId, recipientRole, senderName, conversationId);
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });
    // Typing indicator
    socket.on(socket_types_1.SocketEvents.CHAT_TYPING, (payload) => {
        const { conversationId, isTyping } = payload;
        const roomName = socket_types_1.getRoomName.conversation(conversationId);
        // Broadcast typing status to others in the room (except sender)
        socket.to(roomName).emit(socket_types_1.SocketEvents.CHAT_TYPING_INDICATOR, {
            conversationId,
            userId: user.userId,
            userName: user.email,
            isTyping,
        });
    });
    // Stop typing
    socket.on(socket_types_1.SocketEvents.CHAT_STOP_TYPING, (payload) => {
        const { conversationId } = payload;
        const roomName = socket_types_1.getRoomName.conversation(conversationId);
        socket.to(roomName).emit(socket_types_1.SocketEvents.CHAT_TYPING_INDICATOR, {
            conversationId,
            userId: user.userId,
            userName: user.email,
            isTyping: false,
        });
    });
    // Mark messages as read
    socket.on(socket_types_1.SocketEvents.CHAT_READ, async (payload) => {
        try {
            const { conversationId } = payload;
            await chatService.markMessagesAsRead(conversationId, user.userId, user.role);
            // Notify others in the room that messages were read
            const roomName = socket_types_1.getRoomName.conversation(conversationId);
            socket.to(roomName).emit(socket_types_1.SocketEvents.CHAT_READ, {
                conversationId,
                userId: user.userId,
            });
        }
        catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });
}
//# sourceMappingURL=chat.socket.js.map