import {
  FeedbackCreateDTO,
  FeedbackUpdateDTO,
  FeedbackResponseDTO,
} from "./IFeedback";

export interface IFeedbackService {
  submitFeedback(data: FeedbackCreateDTO): Promise<FeedbackResponseDTO>;
  getAllFeedback(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{ feedbacks: FeedbackResponseDTO[]; total: number }>;
  getFeedbackById(id: string): Promise<FeedbackResponseDTO | null>;
  updateFeedback(
    id: string,
    data: FeedbackUpdateDTO,
  ): Promise<FeedbackResponseDTO | null>;
  getFeaturedFeedback(): Promise<FeedbackResponseDTO[]>;
  getPublicFeedback(): Promise<FeedbackResponseDTO[]>;
  deleteFeedback(id: string): Promise<boolean>;
}
