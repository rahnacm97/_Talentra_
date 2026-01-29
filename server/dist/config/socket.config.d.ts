import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ChatService } from '../services/chat/chat.service';
import { NotificationService } from '../services/notification/notification.service';
import { VideoCallService } from '../services/video-call/video-call.service';
export interface SocketConfig {
    chatService: ChatService;
    notificationService: NotificationService;
    videoCallService: VideoCallService;
}
export declare function initializeSocketIO(httpServer: HTTPServer, config: SocketConfig): SocketIOServer;
//# sourceMappingURL=socket.config.d.ts.map