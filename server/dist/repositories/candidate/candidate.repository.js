"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRepository = void 0;
const base_repository_1 = require("../base.repository");
const Candidate_model_1 = __importDefault(require("../../models/Candidate.model"));
class CandidateRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Candidate_model_1.default);
    }
    findByEmail(email) {
        return this.model.findOne({ email }).select("+password").exec();
    }
    updateBlockStatus(id, block) {
        return this.update(id, {
            blocked: block,
            updatedAt: new Date(),
        });
    }
    updateProfile(id, data) {
        return this.update(id, { ...data, updatedAt: new Date() });
    }
    async saveJob(candidateId, jobId) {
        return this.model
            .findByIdAndUpdate(candidateId, { $addToSet: { savedJobs: jobId } }, { new: true })
            .exec();
    }
    async unsaveJob(candidateId, jobId) {
        return this.model
            .findByIdAndUpdate(candidateId, { $pull: { savedJobs: jobId } }, { new: true })
            .exec();
    }
    async getSavedJobs(candidateId) {
        const candidate = await this.model
            .findById(candidateId)
            .populate({
            path: "savedJobs",
            populate: {
                path: "employerId",
                model: "Employer",
            },
        })
            .exec();
        return candidate?.savedJobs || [];
    }
}
exports.CandidateRepository = CandidateRepository;
//# sourceMappingURL=candidate.repository.js.map