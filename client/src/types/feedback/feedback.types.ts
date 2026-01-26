export interface Feedback {
  id: string;
  userId: string | { _id: string; name: string; profileImage?: string };
  userType: "candidate" | "employer";
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  isFeatured: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackCreateRequest {
  userId?: string;
  userType?: "candidate" | "employer";
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  isPublic?: boolean;
}

export interface FeedbackUpdateRequest {
  isFeatured?: boolean;
  status?: "pending" | "approved" | "rejected";
}

export interface FeedbackState {
  feedbacks: Feedback[];
  featuredFeedbacks: Feedback[];
  publicFeedbacks: Feedback[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  total: number;
}

export interface FeedbackViewModalProps {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}
