"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor(_chatRepository, _applicationRepository, _chatMapper, _chatSocket, _notificationSocket) {
        this._chatRepository = _chatRepository;
        this._applicationRepository = _applicationRepository;
        this._chatMapper = _chatMapper;
        this._chatSocket = _chatSocket;
        this._notificationSocket = _notificationSocket;
    }
    // Chat initiating
    async initiateChat(employerId, candidateId, jobId, applicationId) {
        const existingChat = await this._chatRepository.findChatByApplicationId(applicationId);
        if (existingChat) {
            const existingEmployerId = typeof existingChat.employerId === "object" &&
                existingChat.employerId !== null
                ? existingChat.employerId._id.toString()
                : existingChat.employerId.toString();
            if (existingEmployerId !== employerId) {
                throw new Error("Access denied: You are not authorized to view this chat.");
            }
            return this._chatMapper.toChatResponseDto(existingChat, employerId);
        }
        const application = await this._applicationRepository.findByIdAndEmployer(applicationId, employerId);
        if (!application) {
            throw new Error("Application not found.");
        }
        if (application.status !== "shortlisted") {
            throw new Error("Chat can only be initiated for shortlisted candidates.");
        }
        const newChat = await this._chatRepository.createChat({
            employerId,
            candidateId,
            jobId,
            applicationId,
        });
        return this._chatMapper.toChatResponseDto(newChat, employerId);
    }
    //Fetching user chats
    async getUserChats(userId, role) {
        let chats;
        if (role === "Employer") {
            chats = await this._chatRepository.findChatsByEmployerId(userId);
        }
        else {
            chats = await this._chatRepository.findChatsByCandidateId(userId);
        }
        return chats.map((chat) => this._chatMapper.toChatResponseDto(chat, userId));
    }
    // Message sending
    async sendMessage(data) {
        const message = await this._chatRepository.addMessage(data);
        await this._chatRepository.updateLastMessage(data.chatId, data.content, new Date());
        const chat = await this._chatRepository.findChatById(data.chatId);
        if (chat) {
            const receiverId = data.senderRole === "Employer" ? chat.candidateId : chat.employerId;
            const messageDto = this._chatMapper.toMessageResponseDto(message);
            this._chatSocket.emitMessageToChat(data.chatId, messageDto);
            const notificationPayload = {
                type: "MESSAGE_RECEIVED",
                message: "New message received",
                timestamp: new Date(),
                read: false,
                data: messageDto,
            };
            this._notificationSocket.emitToUser(receiverId, notificationPayload);
        }
        return this._chatMapper.toMessageResponseDto(message);
    }
    //Fetch chat message
    async getChatMessages(chatId, userId) {
        const chat = await this._chatRepository.findChatById(chatId);
        if (!chat) {
            throw new Error("Chat not found");
        }
        const employerId = typeof chat.employerId === "object"
            ? chat.employerId._id.toString()
            : chat.employerId.toString();
        const candidateId = typeof chat.candidateId === "object"
            ? chat.candidateId._id.toString()
            : chat.candidateId.toString();
        if (userId !== employerId && userId !== candidateId) {
            throw new Error("Access denied: You are not authorized to view this chat.");
        }
        const messages = await this._chatRepository.getMessages(chatId);
        return messages.map((msg) => this._chatMapper.toMessageResponseDto(msg));
    }
    // Marking read
    async markMessagesAsRead(chatId, userId) {
        const chat = await this._chatRepository.findChatById(chatId);
        if (!chat) {
            throw new Error("Chat not found");
        }
        const employerId = typeof chat.employerId === "object"
            ? chat.employerId._id.toString()
            : chat.employerId.toString();
        const candidateId = typeof chat.candidateId === "object"
            ? chat.candidateId._id.toString()
            : chat.candidateId.toString();
        if (userId !== employerId && userId !== candidateId) {
            throw new Error("Access denied: You are not authorized to update this chat.");
        }
        await this._chatRepository.markMessagesAsRead(chatId, userId);
    }
    //Delete Chat
    async deleteChat(chatId, userId) {
        const chat = await this._chatRepository.findChatById(chatId);
        if (!chat)
            return;
        const employerId = typeof chat.employerId === "object"
            ? chat.employerId._id.toString()
            : chat.employerId.toString();
        const candidateId = typeof chat.candidateId === "object"
            ? chat.candidateId._id.toString()
            : chat.candidateId.toString();
        if (userId !== employerId && userId !== candidateId) {
            throw new Error("Unauthorized to delete this chat");
        }
        const recipientId = userId === employerId ? candidateId : employerId;
        await this._chatRepository.deleteChat(chatId);
        this._chatSocket.emitChatDeleted(chatId, recipientId);
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map