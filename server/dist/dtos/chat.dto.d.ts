export interface CreateConversationDTO {
    interviewId: string;
    employerId: string;
    candidateId: string;
}
export interface ConversationResponseDTO {
    id: string;
    interviewId: string;
    participants: {
        employer: {
            id: string;
            name: string;
            email: string;
        };
        candidate: {
            id: string;
            name: string;
            email: string;
        };
    };
    lastMessage?: {
        id: string;
        content: string;
        sender: string;
        createdAt: Date;
    };
    unreadCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface SendMessageDTO {
    conversationId: string;
    senderId: string;
    senderRole: 'employer' | 'candidate';
    content: string;
    type?: 'text' | 'file' | 'video_link' | 'system';
    metadata?: {
        fileName?: string;
        fileUrl?: string;
        fileSize?: number;
        videoCallLink?: string;
    };
}
export interface MessageResponseDTO {
    id: string;
    conversationId: string;
    sender: {
        id: string;
        name: string;
        role: 'employer' | 'candidate';
    };
    content: string;
    type: 'text' | 'file' | 'video_link' | 'system';
    metadata?: {
        fileName?: string;
        fileUrl?: string;
        fileSize?: number;
        videoCallLink?: string;
    };
    isRead: boolean;
    createdAt: Date;
}
export interface PaginationDTO {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=chat.dto.d.ts.map