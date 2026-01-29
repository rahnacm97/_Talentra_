"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionMapper = void 0;
class SubscriptionMapper {
    toResponseDTO(subscription) {
        return {
            id: subscription._id.toString(),
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
    toHistoryResponseDTO(subscriptions) {
        return {
            subscriptions: subscriptions.map((sub) => this.toResponseDTO(sub)),
            total: subscriptions.length,
        };
    }
    toCreateData(employerId, planDetails, transactionId) {
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
exports.SubscriptionMapper = SubscriptionMapper;
//# sourceMappingURL=subscription.mapper.js.map