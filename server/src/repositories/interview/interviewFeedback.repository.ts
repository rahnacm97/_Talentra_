import InterviewFeedback, {
  IInterviewFeedbackDocument,
} from "../../models/InterviewFeedback.model";
import { IInterviewFeedbackRepository } from "../../interfaces/interviews/IInterviewRepository";
import {
  IInterviewFeedback,
  IFeedbackWithProvider,
  IFeedbackSummary,
} from "../../interfaces/interviews/IInterview";
import { PipelineStage } from "mongoose";
import mongoose from "mongoose";

export class InterviewFeedbackRepository
  implements IInterviewFeedbackRepository
{
  async create(data: Partial<IInterviewFeedback>): Promise<IInterviewFeedback> {
    const doc = await InterviewFeedback.create(data);
    return this.toDomain(doc);
  }

  async findById(feedbackId: string): Promise<IInterviewFeedback | null> {
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return null;
    }
    const doc = await InterviewFeedback.findById(feedbackId).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByRoundId(roundId: string): Promise<IFeedbackWithProvider[]> {
    const pipeline: PipelineStage[] = [
      { $match: { roundId } },
      ...this.getProviderPipeline(),
      { $sort: { createdAt: -1 } },
    ];

    const docs = await InterviewFeedback.aggregate(pipeline).exec();
    return docs.map((doc) => this.toDetailedDomain(doc));
  }

  async findByApplicationId(
    applicationId: string,
  ): Promise<IFeedbackWithProvider[]> {
    const pipeline: PipelineStage[] = [
      { $match: { applicationId } },
      ...this.getProviderPipeline(),
      { $sort: { createdAt: -1 } },
    ];

    const docs = await InterviewFeedback.aggregate(pipeline).exec();
    return docs.map((doc) => this.toDetailedDomain(doc));
  }

  async findByRoundAndProvider(
    roundId: string,
    providedBy: string,
  ): Promise<IInterviewFeedback | null> {
    const doc = await InterviewFeedback.findOne({
      roundId,
      providedBy,
    }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async updateSharedStatus(
    feedbackId: string,
    isShared: boolean,
  ): Promise<IInterviewFeedback | null> {
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return null;
    }

    const doc = await InterviewFeedback.findByIdAndUpdate(
      feedbackId,
      { $set: { isSharedWithCandidate: isShared } },
      { new: true },
    ).exec();

    return doc ? this.toDomain(doc) : null;
  }

  async getFeedbackSummary(roundId: string): Promise<IFeedbackSummary | null> {
    const pipeline: PipelineStage[] = [
      { $match: { roundId } },
      {
        $group: {
          _id: "$roundId",
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          proceedCount: {
            $sum: { $cond: [{ $eq: ["$recommendation", "proceed"] }, 1, 0] },
          },
          holdCount: {
            $sum: { $cond: [{ $eq: ["$recommendation", "hold"] }, 1, 0] },
          },
          rejectCount: {
            $sum: { $cond: [{ $eq: ["$recommendation", "reject"] }, 1, 0] },
          },
        },
      },
    ];

    const result = await InterviewFeedback.aggregate(pipeline).exec();

    if (!result || result.length === 0) return null;

    const doc = result[0];
    return {
      roundId: doc._id,
      totalFeedback: doc.totalFeedback,
      averageRating: Math.round(doc.averageRating * 10) / 10,
      recommendations: {
        proceed: doc.proceedCount,
        hold: doc.holdCount,
        reject: doc.rejectCount,
      },
    };
  }

  async countByRoundId(roundId: string): Promise<number> {
    return await InterviewFeedback.countDocuments({ roundId }).exec();
  }

  async countByApplicationId(applicationId: string): Promise<number> {
    return await InterviewFeedback.countDocuments({ applicationId }).exec();
  }

  async deleteById(feedbackId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return false;
    }
    const result = await InterviewFeedback.findByIdAndDelete(feedbackId).exec();
    return !!result;
  }

  async deleteByRoundId(roundId: string): Promise<boolean> {
    const result = await InterviewFeedback.deleteMany({ roundId }).exec();
    return result.deletedCount > 0;
  }

  private getProviderPipeline(): PipelineStage[] {
    return [
      { $addFields: { providerIdObj: { $toObjectId: "$providedBy" } } },
      {
        $lookup: {
          from: "employers",
          localField: "providerIdObj",
          foreignField: "_id",
          as: "employerProvider",
        },
      },
      {
        $lookup: {
          from: "candidates",
          localField: "providerIdObj",
          foreignField: "_id",
          as: "candidateProvider",
        },
      },
      {
        $addFields: {
          provider: {
            $cond: {
              if: { $gt: [{ $size: "$employerProvider" }, 0] },
              then: { $arrayElemAt: ["$employerProvider", 0] },
              else: { $arrayElemAt: ["$candidateProvider", 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          roundId: 1,
          applicationId: 1,
          providedBy: 1,
          rating: 1,
          strengths: 1,
          weaknesses: 1,
          comments: 1,
          recommendation: 1,
          technicalSkills: 1,
          communication: 1,
          problemSolving: 1,
          culturalFit: 1,
          isSharedWithCandidate: 1,
          createdAt: 1,
          updatedAt: 1,
          provider: {
            name: "$provider.name",
            email: "$provider.email",
            profileImage: {
              $ifNull: ["$provider.profileImage", "$provider.logo"],
            },
            role: {
              $cond: {
                if: { $gt: [{ $size: "$employerProvider" }, 0] },
                then: "employer",
                else: "candidate",
              },
            },
          },
        },
      },
    ];
  }

  private toDomain(doc: IInterviewFeedbackDocument): IInterviewFeedback {
    return {
      id: doc._id.toString(),
      roundId: doc.roundId,
      applicationId: doc.applicationId,
      providedBy: doc.providedBy,
      rating: doc.rating,
      ...(doc.strengths && { strengths: doc.strengths }),
      ...(doc.weaknesses && { weaknesses: doc.weaknesses }),
      ...(doc.comments && { comments: doc.comments }),
      recommendation: doc.recommendation,
      ...(doc.technicalSkills && { technicalSkills: doc.technicalSkills }),
      ...(doc.communication && { communication: doc.communication }),
      ...(doc.problemSolving && { problemSolving: doc.problemSolving }),
      ...(doc.culturalFit && { culturalFit: doc.culturalFit }),
      isSharedWithCandidate: doc.isSharedWithCandidate,
      ...(doc.createdAt && { createdAt: doc.createdAt }),
      ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
    };
  }

  private toDetailedDomain(
    doc: IInterviewFeedbackDocument & {
      provider?: {
        name: string;
        email: string;
        profileImage: string;
        role: string;
      };
    },
  ): IFeedbackWithProvider {
    return {
      id: doc._id.toString(),
      roundId: doc.roundId,
      applicationId: doc.applicationId,
      providedBy: doc.providedBy,
      rating: doc.rating,
      ...(doc.strengths && { strengths: doc.strengths }),
      ...(doc.weaknesses && { weaknesses: doc.weaknesses }),
      ...(doc.comments && { comments: doc.comments }),
      recommendation: doc.recommendation,
      ...(doc.technicalSkills && { technicalSkills: doc.technicalSkills }),
      ...(doc.communication && { communication: doc.communication }),
      ...(doc.problemSolving && { problemSolving: doc.problemSolving }),
      ...(doc.culturalFit && { culturalFit: doc.culturalFit }),
      isSharedWithCandidate: doc.isSharedWithCandidate,
      ...(doc.createdAt && { createdAt: doc.createdAt }),
      ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
      provider: doc.provider || {
        name: "",
        email: "",
        profileImage: "",
        role: "",
      },
    };
  }
}
