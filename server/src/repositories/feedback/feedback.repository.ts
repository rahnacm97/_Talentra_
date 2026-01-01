import { FilterQuery } from "mongoose";
import { BaseRepository } from "../base.repository";
import { IFeedback } from "../../interfaces/feedback/IFeedback";
import { IFeedbackRepository } from "../../interfaces/feedback/IFeedbackRepository";
import Feedback from "../../models/Feedback.model";
import "../../models/Candidate.model";
import "../../models/Employer.model";

export class FeedbackRepository
  extends BaseRepository<IFeedback>
  implements IFeedbackRepository
{
  constructor() {
    super(Feedback);
  }

  async findAll(
    query: FilterQuery<IFeedback> = {},
    page = 1,
    limit = 10,
  ): Promise<IFeedback[]> {
    return this.model
      .find(query)
      .populate("userId", "name profileImage")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeaturedFeedback(): Promise<IFeedback[]> {
    return this.model
      .find({ isFeatured: true, status: "approved" })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPublicFeedback(): Promise<IFeedback[]> {
    return this.model
      .find({ isPublic: true, status: "approved" })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .exec();
  }

  async repairFeedbackData(): Promise<void> {
    await this.model.updateMany({ userModel: { $exists: false } }, [
      {
        $set: {
          userModel: {
            $cond: {
              if: { $eq: ["$userType", "candidate"] },
              then: "Candidate",
              else: "Employer",
            },
          },
        },
      },
    ]);
  }
}
