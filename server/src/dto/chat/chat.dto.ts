export class CreateChatDto {
  applicationId!: string;
  employerId!: string;
  candidateId!: string;
  jobId!: string;
}

export class SendMessageDto {
  chatId!: string;
  senderId!: string;
  senderRole!: "Employer" | "Candidate";
  content!: string;
}

export class MessageResponseDto {
  id!: string;
  chatId!: string;
  senderId!: string;
  senderRole!: "Employer" | "Candidate";
  content!: string;
  isRead!: boolean;
  createdAt!: Date;
}

export class ChatResponseDto {
  id!: string;
  applicationId!: string;
  employerId!: string;
  candidateId!: string;
  jobId!: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  messages!: MessageResponseDto[];
  candidateName?: string;
  employerName?: string;
  jobTitle?: string;
  avatar?: string;
  unreadCount!: number;
  isOnline!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
