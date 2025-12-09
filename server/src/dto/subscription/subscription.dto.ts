// Request DTOs
export interface CreateOrderRequestDTO {
  amount: number;
  currency?: string;
}

export interface CreateOrderResponseDTO {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface PaymentDetailsDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PlanDetailsDTO {
  plan: "professional" | "enterprise";
  price: number;
  durationInMonths: number;
}

export interface VerifyPaymentRequestDTO {
  paymentDetails: PaymentDetailsDTO;
  planDetails: PlanDetailsDTO;
}

export interface VerifyPaymentResponseDTO {
  success: boolean;
  message: string;
}

// Response DTOs
export interface SubscriptionHistoryItemDTO {
  id: string;
  employerId: string;
  plan: "free" | "professional" | "enterprise";
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "past_due" | "cancelled";
  price: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionHistoryResponseDTO {
  subscriptions: SubscriptionHistoryItemDTO[];
  total: number;
}

// Internal DTOs for data creation
export interface CreateSubscriptionData {
  employerId: string;
  plan: "professional" | "enterprise";
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "past_due" | "cancelled";
  price: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  transactionId: string;
}
