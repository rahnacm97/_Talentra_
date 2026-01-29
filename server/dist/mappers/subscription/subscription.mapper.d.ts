import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { ISubscriptionMapper } from "../../interfaces/subscription/ISubscriptionMapper";
import { SubscriptionHistoryItemDTO, SubscriptionHistoryResponseDTO, CreateSubscriptionData, PlanDetailsDTO } from "../../dto/subscription/subscription.dto";
export declare class SubscriptionMapper implements ISubscriptionMapper {
    toResponseDTO(subscription: ISubscription): SubscriptionHistoryItemDTO;
    toHistoryResponseDTO(subscriptions: ISubscription[]): SubscriptionHistoryResponseDTO;
    toCreateData(employerId: string, planDetails: PlanDetailsDTO, transactionId: string): CreateSubscriptionData;
}
//# sourceMappingURL=subscription.mapper.d.ts.map