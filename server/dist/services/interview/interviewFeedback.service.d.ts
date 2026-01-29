import { IInterviewFeedbackService } from "../../interfaces/interviews/IInterviewService";
import { IInterviewFeedbackRepository, IInterviewRoundRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewFeedback, IFeedbackWithProvider, IFeedbackSummary } from "../../interfaces/interviews/IInterview";
import { INotificationService } from "../../interfaces/shared/INotificationService";
export declare class InterviewFeedbackService implements IInterviewFeedbackService {
    private readonly _repository;
    private readonly _roundRepository;
    private readonly _notificationService;
    constructor(_repository: IInterviewFeedbackRepository, _roundRepository: IInterviewRoundRepository, _notificationService: INotificationService);
    submitFeedback(roundId: string, feedbackData: {
        applicationId: string;
        providedBy: string;
        rating: number;
        strengths?: string;
        weaknesses?: string;
        comments?: string;
        recommendation: string;
        technicalSkills?: number;
        communication?: number;
        problemSolving?: number;
        culturalFit?: number;
    }): Promise<IInterviewFeedback>;
    getFeedbackForRound(roundId: string): Promise<IFeedbackWithProvider[]>;
    getSharedFeedbackForRound(roundId: string): Promise<IFeedbackWithProvider[]>;
    getFeedbackForApplication(applicationId: string): Promise<IFeedbackWithProvider[]>;
    getFeedbackSummary(roundId: string): Promise<IFeedbackSummary | null>;
    shareFeedbackWithCandidate(feedbackId: string): Promise<IInterviewFeedback | null>;
    checkAllFeedbackSubmitted(applicationId: string): Promise<boolean>;
    deleteFeedback(feedbackId: string): Promise<boolean>;
}
//# sourceMappingURL=interviewFeedback.service.d.ts.map