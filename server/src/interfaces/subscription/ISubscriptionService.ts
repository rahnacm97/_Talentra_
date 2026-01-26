import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  SubscriptionHistoryResponseDTO,
} from "../../dto/subscription/subscription.dto";

export interface ISubscriptionService {
  createOrder(request: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO>;
  verifyPayment(
    employerId: string,
    request: VerifyPaymentRequestDTO,
  ): Promise<VerifyPaymentResponseDTO>;
  getSubscriptionHistory(
    employerId: string,
  ): Promise<SubscriptionHistoryResponseDTO>;
}

export interface IInvoiceService {
  generateInvoice(subscription: any, employer: any): any;
}
