"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHandler = exports.videoCallHandler = exports.videoCallService = exports.videoCallRepository = void 0;
const videoCall_repository_1 = require("../../repositories/videoCall/videoCall.repository");
const videoCall_service_1 = require("../../services/videoCall/videoCall.service");
const videoCall_handler_1 = require("../../socket/handlers/videoCall.handler");
const chat_handler_1 = require("../../socket/handlers/chat.handler");
exports.videoCallRepository = new videoCall_repository_1.VideoCallRepository();
exports.videoCallService = new videoCall_service_1.VideoCallService(exports.videoCallRepository);
exports.videoCallHandler = new videoCall_handler_1.VideoCallHandler(exports.videoCallService);
exports.chatHandler = new chat_handler_1.ChatHandler();
//# sourceMappingURL=handler.js.map