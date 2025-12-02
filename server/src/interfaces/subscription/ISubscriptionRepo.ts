import { FilterQuery } from "mongoose";
import { ISubscription } from "./ISubscription";
import { CreateSubscriptionData } from "../../dto/subscription/subscription.dto";

export interface FindSubscriptionOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface ISubscriptionRepository {
  create(data: CreateSubscriptionData): Promise<ISubscription>;
  findById(id: string): Promise<ISubscription | null>;
  findByEmployerId(
    employerId: string,
    options?: FindSubscriptionOptions,
  ): Promise<ISubscription[]>;
  findActiveByEmployerId(employerId: string): Promise<ISubscription | null>;
  count(filter: FilterQuery<ISubscription>): Promise<number>;
}
