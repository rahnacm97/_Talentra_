export declare enum SocketEvents {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    CHAT_JOIN = "chat:join",
    CHAT_LEAVE = "chat:leave",
    CHAT_MESSAGE = "chat:message",
    CHAT_TYPING = "chat:typing",
    CHAT_STOP_TYPING = "chat:stop_typing",
    CHAT_READ = "chat:read",
    CHAT_MESSAGE_RECEIVED = "chat:message_received",
    CHAT_TYPING_INDICATOR = "chat:typing_indicator",
    NOTIFICATION_SUBSCRIBE = "notification:subscribe",
    NOTIFICATION_NEW = "notification:new",
    NOTIFICATION_READ = "notification:read",
    NOTIFICATION_COUNT_UPDATE = "notification:count_update",
    VIDEO_JOIN = "video:join",
    VIDEO_LEAVE = "video:leave",
    VIDEO_OFFER = "video:offer",
    VIDEO_ANSWER = "video:answer",
    VIDEO_ICE_CANDIDATE = "video:ice_candidate",
    VIDEO_USER_JOINED = "video:user_joined",
    VIDEO_USER_LEFT = "video:user_left",
    VIDEO_CALL_ENDED = "video:call_ended",
    PRESENCE_ONLINE = "presence:online",
    PRESENCE_OFFLINE = "presence:offline",
    PRESENCE_STATUS = "presence:status"
}
export interface ChatJoinPayload {
    conversationId: string;
}
export interface ChatMessagePayload {
    conversationId: string;
    content: string;
    type: 'text' | 'file' | 'video_link' | 'system';
    metadata?: {
        fileName?: string;
        fileUrl?: string;
        fileSize?: number;
        videoCallLink?: string;
    };
}
export interface ChatTypingPayload {
    conversationId: string;
    isTyping: boolean;
}
export interface ChatReadPayload {
    conversationId: string;
    messageIds: string[];
}
export interface VideoJoinPayload {
    roomId: string;
    userName: string;
}
export interface VideoOfferPayload {
    roomId: string;
    targetUserId: string;
    offer: any;
}
export interface VideoAnswerPayload {
    roomId: string;
    targetUserId: string;
    answer: any;
}
export interface VideoIceCandidatePayload {
    roomId: string;
    targetUserId: string;
    candidate: any;
}
export interface NotificationPayload {
    userId: string;
    type: 'interview' | 'chat' | 'video_call' | 'application' | 'system';
    title: string;
    message: string;
    data?: Record<string, any>;
}
export interface SocketUserData {
    userId: string;
    role: 'employer' | 'candidate' | 'admin';
    email: string;
}
export declare const getRoomName: {
    conversation: (conversationId: string) => string;
    videoCall: (roomId: string) => string;
    userNotifications: (userId: string) => string;
};
//# sourceMappingURL=socket.types.d.ts.map