import { ISubscription } from "../../interfaces/subscription/ISubscription";
import {
  ISubscriptionRepository,
  FindSubscriptionOptions,
} from "../../interfaces/subscription/ISubscriptionRepo";
import { CreateSubscriptionData } from "../../dto/subscription/subscription.dto";
import SubscriptionModel from "../../models/Subscription.model";
import { FilterQuery } from "mongoose";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(data: CreateSubscriptionData): Promise<ISubscription> {
    const subscription = new SubscriptionModel(data);
    return subscription.save();
  }

  async findById(id: string): Promise<ISubscription | null> {
    return SubscriptionModel.findById(id).exec();
  }

  async findByEmployerId(
    employerId: string,
    options?: FindSubscriptionOptions,
  ): Promise<ISubscription[]> {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options || {};

    return SubscriptionModel.find({ employerId })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findActiveByEmployerId(
    employerId: string,
  ): Promise<ISubscription | null> {
    return SubscriptionModel.findOne({
      employerId,
      status: "active",
      endDate: { $gt: new Date() },
    })
      .sort({ endDate: -1 })
      .exec();
  }

  async count(filter: FilterQuery<ISubscription>): Promise<number> {
    return SubscriptionModel.countDocuments(filter).exec();
  }
}
