"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const logger_1 = require("../../shared/utils/logger");
class InterviewService {
    constructor(_repository, _mapper) {
        this._repository = _repository;
        this._mapper = _mapper;
    }
    //Creating interviews
    async createInterviewFromApplication(data) {
        const existingInterview = await this._repository.findByApplicationId(data.applicationId);
        if (existingInterview) {
            throw new Error("Interview already scheduled for this application");
        }
        const interviewData = {
            applicationId: data.applicationId,
            jobId: data.jobId,
            candidateId: data.candidateId,
            employerId: data.employerId,
            status: "scheduled",
        };
        if (data.interviewDate) {
            interviewData.interviewDate = new Date(data.interviewDate);
        }
        const interview = await this._repository.create(interviewData);
        logger_1.logger.info("Interview created", {
            interviewId: interview.id,
            applicationId: data.applicationId,
        });
        try {
            logger_1.logger.info("Conversation created for interview", {
                interviewId: interview.id,
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to create conversation for interview", {
                interviewId: interview.id,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
        return this._mapper.toDto(interview);
    }
    //Fetching interview scheduled by employer
    async getInterviewsForEmployer(employerId, filters = {}) {
        const page = Math.max(filters.page ?? 1, 1);
        const limit = Math.max(filters.limit ?? 10, 1);
        const [interviews, total] = await Promise.all([
            this._repository.findByEmployerId(employerId, filters),
            this._repository.countByEmployerId(employerId, {
                ...(filters.status && { status: filters.status }),
                ...(filters.search && { search: filters.search }),
            }),
        ]);
        return {
            interviews: this._mapper.toDetailedDtoList(interviews),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    //Fetcching candidate interviews
    async getInterviewsForCandidate(candidateId, filters = {}) {
        const page = Math.max(filters.page ?? 1, 1);
        const limit = Math.max(filters.limit ?? 10, 1);
        const [interviews, total] = await Promise.all([
            this._repository.findByCandidateId(candidateId, filters),
            this._repository.countByCandidateId(candidateId, {
                ...(filters.status && { status: filters.status }),
                ...(filters.search && { search: filters.search }),
            }),
        ]);
        return {
            interviews: this._mapper.toDetailedDtoList(interviews),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateInterviewStatus(interviewId, status, employerId) {
        const interview = await this._repository.findById(interviewId);
        if (!interview) {
            throw new Error("Interview not found");
        }
        if (interview.employerId !== employerId) {
            throw new Error("Unauthorized: You do not own this interview");
        }
        const updated = await this._repository.updateOne(interviewId, {
            status: status,
        });
        if (!updated) {
            throw new Error("Failed to update interview status");
        }
        logger_1.logger.info("Interview status updated", { interviewId, status });
        return this._mapper.toDto(updated);
    }
}
exports.InterviewService = InterviewService;
//# sourceMappingURL=interview.service.js.map