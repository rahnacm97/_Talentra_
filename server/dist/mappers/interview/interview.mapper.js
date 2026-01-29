"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewMapper = void 0;
class InterviewMapper {
    toDto(interview) {
        return {
            id: interview.id,
            applicationId: interview.applicationId,
            jobId: interview.jobId,
            candidateId: interview.candidateId,
            employerId: interview.employerId,
            ...(interview.interviewDate && {
                interviewDate: interview.interviewDate,
            }),
            status: interview.status,
            ...(interview.notes && { notes: interview.notes }),
            ...(interview.feedback && { feedback: interview.feedback }),
            ...(interview.createdAt && { createdAt: interview.createdAt }),
            ...(interview.updatedAt && { updatedAt: interview.updatedAt }),
        };
    }
    toDtoList(interviews) {
        return interviews.map((interview) => this.toDto(interview));
    }
    toDetailedDto(interview) {
        return {
            id: interview.id,
            applicationId: interview.applicationId,
            jobId: interview.jobId,
            candidateId: interview.candidateId,
            employerId: interview.employerId,
            ...(interview.interviewDate && {
                interviewDate: interview.interviewDate,
            }),
            status: interview.status,
            ...(interview.notes && { notes: interview.notes }),
            ...(interview.feedback && { feedback: interview.feedback }),
            ...(interview.createdAt && { createdAt: interview.createdAt }),
            ...(interview.updatedAt && { updatedAt: interview.updatedAt }),
            job: interview.job,
            candidate: interview.candidate,
            employer: interview.employer,
        };
    }
    toDetailedDtoList(interviews) {
        return interviews.map((interview) => this.toDetailedDto(interview));
    }
}
exports.InterviewMapper = InterviewMapper;
//# sourceMappingURL=interview.mapper.js.map