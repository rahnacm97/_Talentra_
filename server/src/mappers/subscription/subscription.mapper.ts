import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { ISubscriptionMapper } from "../../interfaces/subscription/ISubscriptionMapper";
import {
  SubscriptionHistoryItemDTO,
  SubscriptionHistoryResponseDTO,
  CreateSubscriptionData,
  PlanDetailsDTO,
} from "../../dto/subscription/subscription.dto";

export class SubscriptionMapper implements ISubscriptionMapper {
  toResponseDTO(subscription: ISubscription): SubscriptionHistoryItemDTO {
    return {
      id: (subscription._id as string).toString(),
      employerId: subscription.employerId.toString(),
      plan: subscription.plan,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
      status: subscription.status,
      price: subscription.price,
      subtotal: subscription.subtotal,
      gstRate: subscription.gstRate,
      gstAmount: subscription.gstAmount,
      totalAmount: subscription.totalAmount,
      transactionId: subscription.transactionId || "",
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
  }

  toHistoryResponseDTO(
    subscriptions: ISubscription[],
  ): SubscriptionHistoryResponseDTO {
    return {
      subscriptions: subscriptions.map((sub) => this.toResponseDTO(sub)),
      total: subscriptions.length,
    };
  }

  toCreateData(
    employerId: string,
    planDetails: PlanDetailsDTO,
    transactionId: string,
  ): CreateSubscriptionData {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planDetails.durationInMonths);

    const GST_RATE = 0.18;
    const subtotal = planDetails.price;
    const gstAmount = subtotal * GST_RATE;
    const totalAmount = subtotal + gstAmount;

    return {
      employerId,
      plan: planDetails.plan,
      startDate,
      endDate,
      status: "active",
      price: planDetails.price,
      subtotal,
      gstRate: GST_RATE,
      gstAmount,
      totalAmount,
      transactionId,
    };
  }
}
