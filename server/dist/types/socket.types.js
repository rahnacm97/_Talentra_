"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomName = exports.SocketEvents = void 0;
// Socket.IO Event Names
var SocketEvents;
(function (SocketEvents) {
    // Connection
    SocketEvents["CONNECTION"] = "connection";
    SocketEvents["DISCONNECT"] = "disconnect";
    // Chat Events
    SocketEvents["CHAT_JOIN"] = "chat:join";
    SocketEvents["CHAT_LEAVE"] = "chat:leave";
    SocketEvents["CHAT_MESSAGE"] = "chat:message";
    SocketEvents["CHAT_TYPING"] = "chat:typing";
    SocketEvents["CHAT_STOP_TYPING"] = "chat:stop_typing";
    SocketEvents["CHAT_READ"] = "chat:read";
    SocketEvents["CHAT_MESSAGE_RECEIVED"] = "chat:message_received";
    SocketEvents["CHAT_TYPING_INDICATOR"] = "chat:typing_indicator";
    // Notification Events
    SocketEvents["NOTIFICATION_SUBSCRIBE"] = "notification:subscribe";
    SocketEvents["NOTIFICATION_NEW"] = "notification:new";
    SocketEvents["NOTIFICATION_READ"] = "notification:read";
    SocketEvents["NOTIFICATION_COUNT_UPDATE"] = "notification:count_update";
    // Video Call Events (WebRTC Signaling)
    SocketEvents["VIDEO_JOIN"] = "video:join";
    SocketEvents["VIDEO_LEAVE"] = "video:leave";
    SocketEvents["VIDEO_OFFER"] = "video:offer";
    SocketEvents["VIDEO_ANSWER"] = "video:answer";
    SocketEvents["VIDEO_ICE_CANDIDATE"] = "video:ice_candidate";
    SocketEvents["VIDEO_USER_JOINED"] = "video:user_joined";
    SocketEvents["VIDEO_USER_LEFT"] = "video:user_left";
    SocketEvents["VIDEO_CALL_ENDED"] = "video:call_ended";
    // Presence Events
    SocketEvents["PRESENCE_ONLINE"] = "presence:online";
    SocketEvents["PRESENCE_OFFLINE"] = "presence:offline";
    SocketEvents["PRESENCE_STATUS"] = "presence:status";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
// Room naming conventions
exports.getRoomName = {
    conversation: (conversationId) => `conversation:${conversationId}`,
    videoCall: (roomId) => `video:${roomId}`,
    userNotifications: (userId) => `notifications:${userId}`,
};
//# sourceMappingURL=socket.types.js.map