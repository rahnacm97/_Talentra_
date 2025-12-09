export interface Notification {
  id: string;
  recipientId: string;
  recipientType: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
