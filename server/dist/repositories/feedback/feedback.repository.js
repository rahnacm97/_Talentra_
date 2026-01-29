"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRepository = void 0;
const base_repository_1 = require("../base.repository");
const Feedback_model_1 = __importDefault(require("../../models/Feedback.model"));
require("../../models/Candidate.model");
require("../../models/Employer.model");
class FeedbackRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Feedback_model_1.default);
    }
    async findAll(query = {}, page = 1, limit = 10) {
        return this.model
            .find(query)
            .populate("userId", "name profileImage")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
    }
    async getFeaturedFeedback() {
        return this.model
            .find({ isFeatured: true, status: "approved" })
            .populate("userId", "name profileImage")
            .sort({ createdAt: -1 })
            .exec();
    }
    async getPublicFeedback() {
        return this.model
            .find({ isPublic: true, status: "approved" })
            .populate("userId", "name profileImage")
            .sort({ createdAt: -1 })
            .exec();
    }
    async repairFeedbackData() {
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
exports.FeedbackRepository = FeedbackRepository;
//# sourceMappingURL=feedback.repository.js.map