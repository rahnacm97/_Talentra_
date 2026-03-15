import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  SubscriptionHistoryResponseDTO,
} from "../../dto/subscription/subscription.dto";
import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { FindSubscriptionOptions } from "./ISubscriptionRepo";

export interface ISubscriptionService {
  createOrder(request: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO>;
  verifyPayment(
    employerId: string,
    request: VerifyPaymentRequestDTO,
  ): Promise<VerifyPaymentResponseDTO>;
  getSubscriptionHistory(
    employerId: string,
  ): Promise<SubscriptionHistoryResponseDTO>;
  getAllSubscriptions(options?: FindSubscriptionOptions): Promise<{
    subscriptions: ISubscription[];
    total: number;
    totalRevenue: number;
  }>;
}

export interface IInvoiceService {
  generateInvoice(
    subscription: ISubscription,
    employer: IEmployer,
  ): PDFKit.PDFDocument;
}
