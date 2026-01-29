import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../services/chat/chat.service';
import { NotificationService } from '../services/notification/notification.service';
export declare function setupChatHandlers(io: SocketIOServer, socket: Socket, chatService: ChatService, notificationService: NotificationService): void;
//# sourceMappingURL=chat.socket.d.ts.map