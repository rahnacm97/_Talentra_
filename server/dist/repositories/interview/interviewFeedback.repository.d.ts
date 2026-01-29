import { IInterviewFeedbackRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewFeedback, IFeedbackWithProvider, IFeedbackSummary } from "../../interfaces/interviews/IInterview";
export declare class InterviewFeedbackRepository implements IInterviewFeedbackRepository {
    create(data: Partial<IInterviewFeedback>): Promise<IInterviewFeedback>;
    findById(feedbackId: string): Promise<IInterviewFeedback | null>;
    findByRoundId(roundId: string): Promise<IFeedbackWithProvider[]>;
    findByApplicationId(applicationId: string): Promise<IFeedbackWithProvider[]>;
    findByRoundAndProvider(roundId: string, providedBy: string): Promise<IInterviewFeedback | null>;
    updateSharedStatus(feedbackId: string, isShared: boolean): Promise<IInterviewFeedback | null>;
    getFeedbackSummary(roundId: string): Promise<IFeedbackSummary | null>;
    countByRoundId(roundId: string): Promise<number>;
    countByApplicationId(applicationId: string): Promise<number>;
    deleteById(feedbackId: string): Promise<boolean>;
    deleteByRoundId(roundId: string): Promise<boolean>;
    private getProviderPipeline;
    private toDomain;
    private toDetailedDomain;
}
//# sourceMappingURL=interviewFeedback.repository.d.ts.map