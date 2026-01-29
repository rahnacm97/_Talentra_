import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterview, IInterviewQuery, IInterviewWithDetails } from "../../interfaces/interviews/IInterview";
import { FilterQuery } from "mongoose";
export declare class InterviewRepository implements IInterviewRepository {
    create(data: Partial<IInterview>): Promise<IInterview>;
    findByApplicationId(applicationId: string): Promise<IInterview | null>;
    findById(interviewId: string): Promise<IInterview | null>;
    findByIdWithDetails(interviewId: string): Promise<IInterviewWithDetails | null>;
    findByEmployerId(employerId: string, query?: IInterviewQuery): Promise<IInterviewWithDetails[]>;
    findByCandidateId(candidateId: string, query?: IInterviewQuery): Promise<IInterviewWithDetails[]>;
    countByEmployerId(employerId: string, filters?: {
        status?: string;
        search?: string;
    }): Promise<number>;
    countByCandidateId(candidateId: string, filters?: {
        status?: string;
        search?: string;
    }): Promise<number>;
    updateOne(interviewId: string, data: Partial<IInterview>): Promise<IInterview | null>;
    deleteByApplicationId(applicationId: string): Promise<boolean>;
    private toDomain;
    count(query?: FilterQuery<IInterview>): Promise<number>;
}
//# sourceMappingURL=interview.repository.d.ts.map