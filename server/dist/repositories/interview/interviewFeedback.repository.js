"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewFeedbackRepository = void 0;
const InterviewFeedback_model_1 = __importDefault(require("../../models/InterviewFeedback.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class InterviewFeedbackRepository {
    async create(data) {
        const doc = await InterviewFeedback_model_1.default.create(data);
        return this.toDomain(doc);
    }
    async findById(feedbackId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(feedbackId)) {
            return null;
        }
        const doc = await InterviewFeedback_model_1.default.findById(feedbackId).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async findByRoundId(roundId) {
        const pipeline = [
            { $match: { roundId } },
            ...this.getProviderPipeline(),
            { $sort: { createdAt: -1 } },
        ];
        const docs = await InterviewFeedback_model_1.default.aggregate(pipeline).exec();
        return docs.map((doc) => this.toDetailedDomain(doc));
    }
    async findByApplicationId(applicationId) {
        const pipeline = [
            { $match: { applicationId } },
            ...this.getProviderPipeline(),
            { $sort: { createdAt: -1 } },
        ];
        const docs = await InterviewFeedback_model_1.default.aggregate(pipeline).exec();
        return docs.map((doc) => this.toDetailedDomain(doc));
    }
    async findByRoundAndProvider(roundId, providedBy) {
        const doc = await InterviewFeedback_model_1.default.findOne({
            roundId,
            providedBy,
        }).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async updateSharedStatus(feedbackId, isShared) {
        if (!mongoose_1.default.Types.ObjectId.isValid(feedbackId)) {
            return null;
        }
        const doc = await InterviewFeedback_model_1.default.findByIdAndUpdate(feedbackId, { $set: { isSharedWithCandidate: isShared } }, { new: true }).exec();
        return doc ? this.toDomain(doc) : null;
    }
    async getFeedbackSummary(roundId) {
        const pipeline = [
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
        const result = await InterviewFeedback_model_1.default.aggregate(pipeline).exec();
        if (!result || result.length === 0)
            return null;
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
    async countByRoundId(roundId) {
        return await InterviewFeedback_model_1.default.countDocuments({ roundId }).exec();
    }
    async countByApplicationId(applicationId) {
        return await InterviewFeedback_model_1.default.countDocuments({ applicationId }).exec();
    }
    async deleteById(feedbackId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(feedbackId)) {
            return false;
        }
        const result = await InterviewFeedback_model_1.default.findByIdAndDelete(feedbackId).exec();
        return !!result;
    }
    async deleteByRoundId(roundId) {
        const result = await InterviewFeedback_model_1.default.deleteMany({ roundId }).exec();
        return result.deletedCount > 0;
    }
    getProviderPipeline() {
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
    toDomain(doc) {
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
    toDetailedDomain(doc) {
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
exports.InterviewFeedbackRepository = InterviewFeedbackRepository;
//# sourceMappingURL=interviewFeedback.repository.js.map