export interface CreateNotificationDTO {
    userId: string;
    userRole: 'employer' | 'candidate' | 'admin';
    type: 'interview' | 'chat' | 'video_call' | 'application' | 'system';
    title: string;
    message: string;
    data?: {
        interviewId?: string;
        conversationId?: string;
        applicationId?: string;
        videoCallId?: string;
        link?: string;
    };
}
export interface NotificationResponseDTO {
    id: string;
    type: 'interview' | 'chat' | 'video_call' | 'application' | 'system';
    title: string;
    message: string;
    data?: {
        interviewId?: string;
        conversationId?: string;
        applicationId?: string;
        videoCallId?: string;
        link?: string;
    } | undefined;
    isRead: boolean;
    createdAt: Date;
}
export interface NotificationFiltersDTO {
    type?: 'interview' | 'chat' | 'video_call' | 'application' | 'system';
    isRead?: boolean;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=notification.dto.d.ts.map