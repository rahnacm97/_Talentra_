import { ISubscriptionMapper } from "../../interfaces/subscription/ISubscriptionMapper";
import { SubscriptionHistoryResponseDTO } from "../../dto/subscription/subscription.dto";

export class SubscriptionMapper implements ISubscriptionMapper {
  toCreateData(
    employerId: string,
    planDetails: any,
    razorpayPaymentId: string,
  ): any {
    const durationDays = planDetails.plan === "monthly" ? 30 : 365;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    return {
      employerId,
      plan: planDetails.plan,
      amount: planDetails.amount,
      paymentId: razorpayPaymentId,
      startDate: new Date(),
      endDate: endDate,
      status: "active",
    };
  }

  toHistoryResponseDTO(subscriptions: any[]): SubscriptionHistoryResponseDTO {
    return {
      subscriptions: subscriptions.map((sub) => ({
        id: sub._id.toString(),
        plan: sub.plan,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        amount: sub.amount,
        paymentId: sub.paymentId,
      })),
    };
  }
}
