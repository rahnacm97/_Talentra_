import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  SubscriptionHistoryResponseDTO,
} from "../../dto/subscription/subscription.dto";
import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

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
  generateInvoice(
    subscription: ISubscription,
    employer: IEmployer,
  ): PDFKit.PDFDocument;
}
