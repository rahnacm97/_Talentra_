import { SubscriptionHistoryResponseDTO } from "../../dto/subscription/subscription.dto";

export interface ISubscriptionMapper {
  toCreateData(employerId: string, planDetails: any, razorpayPaymentId: string): any;
  toHistoryResponseDTO(subscriptions: any[]): SubscriptionHistoryResponseDTO;
}
