import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewMapper } from "../../interfaces/interviews/IInterviewMapper";
import { InterviewResponseDto, InterviewsPaginatedDto } from "../../dto/interview/interview.dto";
import { IInterviewQuery } from "../../interfaces/interviews/IInterview";
export declare class InterviewService implements IInterviewService {
    private readonly _repository;
    private readonly _mapper;
    constructor(_repository: IInterviewRepository, _mapper: IInterviewMapper);
    createInterviewFromApplication(data: {
        applicationId: string;
        jobId: string;
        candidateId: string;
        employerId: string;
        interviewDate?: string;
    }): Promise<InterviewResponseDto>;
    getInterviewsForEmployer(employerId: string, filters?: IInterviewQuery): Promise<InterviewsPaginatedDto>;
    getInterviewsForCandidate(candidateId: string, filters?: IInterviewQuery): Promise<InterviewsPaginatedDto>;
    updateInterviewStatus(interviewId: string, status: string, employerId: string): Promise<InterviewResponseDto>;
}
//# sourceMappingURL=interview.service.d.ts.map