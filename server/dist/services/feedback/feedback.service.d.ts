import { IFeedbackService } from "../../interfaces/feedback/IFeedbackService";
import { IFeedbackRepository } from "../../interfaces/feedback/IFeedbackRepository";
import { IFeedbackMapper } from "../../interfaces/feedback/IFeedbackMapper";
import { FeedbackCreateDTO, FeedbackUpdateDTO, FeedbackResponseDTO } from "../../interfaces/feedback/IFeedback";
import { INotificationService } from "../../interfaces/shared/INotificationService";
export declare class FeedbackService implements IFeedbackService {
    private readonly _feedbackRepo;
    private readonly _feedbackMapper;
    private readonly _notificationService;
    constructor(_feedbackRepo: IFeedbackRepository, _feedbackMapper: IFeedbackMapper, _notificationService: INotificationService);
    submitFeedback(data: FeedbackCreateDTO): Promise<FeedbackResponseDTO>;
    getAllFeedback(page?: number, limit?: number, search?: string): Promise<{
        feedbacks: FeedbackResponseDTO[];
        total: number;
    }>;
    getFeedbackById(id: string): Promise<FeedbackResponseDTO | null>;
    updateFeedback(id: string, data: FeedbackUpdateDTO): Promise<FeedbackResponseDTO | null>;
    getFeaturedFeedback(): Promise<FeedbackResponseDTO[]>;
    getPublicFeedback(): Promise<FeedbackResponseDTO[]>;
    deleteFeedback(id: string): Promise<boolean>;
}
//# sourceMappingURL=feedback.service.d.ts.map