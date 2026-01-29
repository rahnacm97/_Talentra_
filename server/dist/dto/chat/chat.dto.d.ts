export declare class CreateChatDto {
    applicationId: string;
    employerId: string;
    candidateId: string;
    jobId: string;
}
export declare class SendMessageDto {
    chatId: string;
    senderId: string;
    senderRole: "Employer" | "Candidate";
    content: string;
}
export declare class MessageResponseDto {
    id: string;
    chatId: string;
    senderId: string;
    senderRole: "Employer" | "Candidate";
    content: string;
    isRead: boolean;
    createdAt: Date;
}
export declare class ChatResponseDto {
    id: string;
    applicationId: string;
    employerId: string;
    candidateId: string;
    jobId: string;
    lastMessage?: string;
    lastMessageAt?: Date;
    messages: MessageResponseDto[];
    candidateName?: string;
    employerName?: string;
    jobTitle?: string;
    avatar?: string;
    unreadCount: number;
    isOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=chat.dto.d.ts.map