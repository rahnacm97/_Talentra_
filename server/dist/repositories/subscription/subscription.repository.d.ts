import { ISubscription } from "../../interfaces/subscription/ISubscription";
import { ISubscriptionRepository, FindSubscriptionOptions } from "../../interfaces/subscription/ISubscriptionRepo";
import { CreateSubscriptionData } from "../../dto/subscription/subscription.dto";
import { FilterQuery } from "mongoose";
export declare class SubscriptionRepository implements ISubscriptionRepository {
    create(data: CreateSubscriptionData): Promise<ISubscription>;
    findById(id: string): Promise<ISubscription | null>;
    findByEmployerId(employerId: string, options?: FindSubscriptionOptions): Promise<ISubscription[]>;
    findActiveByEmployerId(employerId: string): Promise<ISubscription | null>;
    count(filter: FilterQuery<ISubscription>): Promise<number>;
    updateStatus(id: string, status: "active" | "expired" | "past_due" | "cancelled"): Promise<void>;
}
//# sourceMappingURL=subscription.repository.d.ts.map