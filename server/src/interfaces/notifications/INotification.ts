export interface INotification {
  _id: string;
  recipientId: string;
  recipientType: "Admin" | "Employer" | "Candidate";
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
