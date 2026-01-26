import { BaseRepository } from "../base.repository";
import { ISubscriptionRepository } from "../../interfaces/subscription/ISubscriptionRepo";
import Subscription from "../../models/Subscription.model";

export class SubscriptionRepository
  extends BaseRepository<any>
  implements ISubscriptionRepository
{
  constructor() {
    super(Subscription);
  }

  async create(data: any): Promise<any> {
    return await Subscription.create(data);
  }

  async findByEmployerId(employerId: string, options?: any): Promise<any[]> {
    return await Subscription.find({ employerId }, null, options);
  }

  async updateStatus(id: string, status: string): Promise<any> {
    return await Subscription.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findById(id: string): Promise<any | null> {
    return await Subscription.findById(id);
  }
}
