import { ISubscription } from "./ISubscription";
import {
  SubscriptionHistoryItemDTO,
  SubscriptionHistoryResponseDTO,
  CreateSubscriptionData,
  PlanDetailsDTO,
} from "../../dto/subscription/subscription.dto";

export interface ISubscriptionMapper {
  toResponseDTO(subscription: ISubscription): SubscriptionHistoryItemDTO;
  toHistoryResponseDTO(
    subscriptions: ISubscription[],
  ): SubscriptionHistoryResponseDTO;
  toCreateData(
    employerId: string,
    planDetails: PlanDetailsDTO,
    transactionId: string,
  ): CreateSubscriptionData;
}
