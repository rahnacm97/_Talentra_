import { FilterQuery } from "mongoose";
import { BaseRepository } from "../base.repository";
import { IFeedback } from "../../interfaces/feedback/IFeedback";
import { IFeedbackRepository } from "../../interfaces/feedback/IFeedbackRepository";
import "../../models/Candidate.model";
import "../../models/Employer.model";
export declare class FeedbackRepository extends BaseRepository<IFeedback> implements IFeedbackRepository {
    constructor();
    findAll(query?: FilterQuery<IFeedback>, page?: number, limit?: number): Promise<IFeedback[]>;
    getFeaturedFeedback(): Promise<IFeedback[]>;
    getPublicFeedback(): Promise<IFeedback[]>;
    repairFeedbackData(): Promise<void>;
}
//# sourceMappingURL=feedback.repository.d.ts.map