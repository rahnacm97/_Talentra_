import { VideoCallRepository } from "../../repositories/videoCall/videoCall.repository";
import { VideoCallService } from "../../services/videoCall/videoCall.service";
import { VideoCallHandler } from "../../socket/handlers/videoCall.handler";
import { ChatHandler } from "../../socket/handlers/chat.handler";

export const videoCallRepository = new VideoCallRepository();
export const videoCallService = new VideoCallService(videoCallRepository);
export const videoCallHandler = new VideoCallHandler(videoCallService);

export const chatHandler = new ChatHandler();
