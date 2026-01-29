import { IInterviewRoundRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewRound, IInterviewRoundQuery, IInterviewRoundWithDetails } from "../../interfaces/interviews/IInterview";
export declare class InterviewRoundRepository implements IInterviewRoundRepository {
    create(data: Partial<IInterviewRound>): Promise<IInterviewRound>;
    findById(roundId: string): Promise<IInterviewRound | null>;
    findByIdWithDetails(roundId: string): Promise<IInterviewRoundWithDetails | null>;
    findByApplicationId(applicationId: string, query?: IInterviewRoundQuery): Promise<IInterviewRoundWithDetails[]>;
    findByCandidateId(candidateId: string, query?: IInterviewRoundQuery): Promise<IInterviewRoundWithDetails[]>;
    findByEmployerId(employerId: string, query?: IInterviewRoundQuery): Promise<IInterviewRoundWithDetails[]>;
    findByMeetingToken(roundId: string, token: string): Promise<IInterviewRound | null>;
    updateOne(roundId: string, data: Partial<IInterviewRound>): Promise<IInterviewRound | null>;
    countByApplicationId(applicationId: string): Promise<number>;
    countByStatus(applicationId: string, status: string): Promise<number>;
    countByCandidateId(candidateId: string, filters?: {
        status?: string;
        search?: string;
    }): Promise<number>;
    countByEmployerId(employerId: string, filters?: {
        status?: string;
        search?: string;
    }): Promise<number>;
    deleteById(roundId: string): Promise<boolean>;
    private getDetailsPipeline;
    private toDomain;
    private toDetailedDomain;
}
//# sourceMappingURL=interviewRound.repository.d.ts.map