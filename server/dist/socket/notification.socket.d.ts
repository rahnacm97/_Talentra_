import { Server } from "socket.io";
import { INotificationSocketService } from "../interfaces/socket/INotificationSocketService";
import { NotificationResponseDto } from "../dto/notification/notification.dto";
export declare class NotificationSocket implements INotificationSocketService {
    private static _instance;
    private _io;
    private constructor();
    static getInstance(): NotificationSocket;
    initialize(io: Server): void;
    emitToUser(userId: string, notification: NotificationResponseDto): void;
    emitToAdmins(notification: NotificationResponseDto): void;
}
//# sourceMappingURL=notification.socket.d.ts.map