import { ISubscription } from "../../interfaces/subscription/ISubscription";
import {
  ISubscriptionRepository,
  FindSubscriptionOptions,
} from "../../interfaces/subscription/ISubscriptionRepo";
import { CreateSubscriptionData } from "../../dto/subscription/subscription.dto";
import SubscriptionModel from "../../models/Subscription.model";
import EmployerModel from "../../models/Employer.model";
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
    }).exec();
  }

  async count(filter: FilterQuery<ISubscription>): Promise<number> {
    return SubscriptionModel.countDocuments(filter).exec();
  }

  async findAll(options?: FindSubscriptionOptions): Promise<ISubscription[]> {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      search,
      status,
    } = options || {};

    const query: FilterQuery<ISubscription> = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const employers = await EmployerModel.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.employerId = {
        $in: employers.map((e) => e._id),
      };
    }

    return SubscriptionModel.find(query)
      .populate("employerId", "name email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countAll(options?: FindSubscriptionOptions): Promise<number> {
    const { search, status } = options || {};
    const query: FilterQuery<ISubscription> = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const employers = await EmployerModel.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.employerId = {
        $in: employers.map((e) => e._id),
      };
    }
    return SubscriptionModel.countDocuments(query).exec();
  }

  async getTotalRevenue(): Promise<number> {
    const result = await SubscriptionModel.aggregate<{ total: number }>([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    return result[0]?.total || 0;
  }

  async updateStatus(
    id: string,
    status: "active" | "expired" | "past_due" | "cancelled",
  ): Promise<void> {
    await SubscriptionModel.findByIdAndUpdate(id, { status }).exec();
  }
}
