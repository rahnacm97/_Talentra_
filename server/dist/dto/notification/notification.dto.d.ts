import { NotificationType } from "../../shared/enums/enums";
export interface CreateNotificationDto {
    recipientId: string;
    recipientType: "Admin" | "Employer" | "Candidate";
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
}
export interface NotificationResponseDto {
    id: string;
    recipientId: string;
    recipientType: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown> | undefined;
    isRead: boolean;
    createdAt: string;
    readAt?: string | undefined;
}
export interface NotificationStatsDto {
    total: number;
    unread: number;
}
//# sourceMappingURL=notification.dto.d.ts.map