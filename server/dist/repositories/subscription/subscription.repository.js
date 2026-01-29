"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const Subscription_model_1 = __importDefault(require("../../models/Subscription.model"));
class SubscriptionRepository {
    async create(data) {
        const subscription = new Subscription_model_1.default(data);
        return subscription.save();
    }
    async findById(id) {
        return Subscription_model_1.default.findById(id).exec();
    }
    async findByEmployerId(employerId, options) {
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options || {};
        return Subscription_model_1.default.find({ employerId })
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }
    async findActiveByEmployerId(employerId) {
        return Subscription_model_1.default.findOne({
            employerId,
            status: "active",
            endDate: { $gt: new Date() },
        })
            .sort({ endDate: -1 })
            .exec();
    }
    async count(filter) {
        return Subscription_model_1.default.countDocuments(filter).exec();
    }
    async updateStatus(id, status) {
        await Subscription_model_1.default.findByIdAndUpdate(id, { status }).exec();
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
//# sourceMappingURL=subscription.repository.js.map