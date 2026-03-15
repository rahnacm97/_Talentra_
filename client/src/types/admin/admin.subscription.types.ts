export interface AdminSubscription {
  _id: string;
  employerId: {
    _id: string;
    name: string;
    email: string;
  };
  plan: "free" | "professional" | "enterprise";
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "past_due" | "cancelled";
  price: number;
  totalAmount: number;
  transactionId: string;
  createdAt: string;
}

export interface AdminSubscriptionState {
  subscriptions: AdminSubscription[];
  total: number;
  totalRevenue: number;
  loading: boolean;
  error: string | null;
}
