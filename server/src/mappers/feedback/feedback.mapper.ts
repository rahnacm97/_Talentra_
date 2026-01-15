import { IFeedbackMapper } from "../../interfaces/feedback/IFeedbackMapper";
import {
  IFeedback,
  FeedbackResponseDTO,
} from "../../interfaces/feedback/IFeedback";

export class FeedbackMapper implements IFeedbackMapper {
  toResponseDto(feedback: IFeedback): FeedbackResponseDTO {
    return {
      id: feedback._id?.toString() || "",
      userId: feedback.userId,
      userType: feedback.userType,
      userModel: feedback.userModel,
      userName: feedback.userName,
      userAvatar: feedback.userAvatar,
      rating: feedback.rating,
      comment: feedback.comment,
      isPublic: feedback.isPublic,
      isFeatured: feedback.isFeatured,
      status: feedback.status,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }

  toResponseDtoList(feedbacks: IFeedback[]): FeedbackResponseDTO[] {
    return feedbacks.map((f) => this.toResponseDto(f));
  }
}
