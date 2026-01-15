export interface IMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: "Employer" | "Candidate";
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface IChat {
  id: string;
  applicationId: string;
  employerId: string;
  candidateId: string;
  jobId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  messages?: IMessage[];
  createdAt: string;
  updatedAt: string;
  // UI helpers
  candidateName?: string;
  employerName?: string;
  jobTitle?: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
}

export interface CreateChatPayload {
  candidateId: string;
  jobId: string;
  applicationId: string;
}

export interface ChatState {
  chats: IChat[];
  activeChat: IChat | null;
  messages: IMessage[];
  loading: boolean;
  error: string | null;
  messageSending: boolean;
}
