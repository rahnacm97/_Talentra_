import { IFeedbackService } from "../../interfaces/feedback/IFeedbackService";
import { IFeedbackRepository } from "../../interfaces/feedback/IFeedbackRepository";
import { IFeedbackMapper } from "../../interfaces/feedback/IFeedbackMapper";
import {
  IFeedback,
  FeedbackCreateDTO,
  FeedbackUpdateDTO,
  FeedbackResponseDTO,
} from "../../interfaces/feedback/IFeedback";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { Types, FilterQuery } from "mongoose";

import { INotificationService } from "../../interfaces/shared/INotificationService";

export class FeedbackService implements IFeedbackService {
  constructor(
    private readonly _feedbackRepo: IFeedbackRepository,
    private readonly _feedbackMapper: IFeedbackMapper,

    private readonly _notificationService: INotificationService,

  ) {}

  //Feedback submission
  async submitFeedback(data: FeedbackCreateDTO): Promise<FeedbackResponseDTO> {
    const feedbackData: Partial<IFeedback> = {
      userId: new Types.ObjectId(data.userId) as unknown as Types.ObjectId,
      userType: data.userType,
      userModel: data.userType === "candidate" ? "Candidate" : "Employer",
      userName: data.userName,
      userAvatar: data.userAvatar,
      rating: data.rating,
      comment: data.comment,
      isPublic: data.isPublic ?? true,
      status: "pending",
      isFeatured: false,
    };
    const feedback = await this._feedbackRepo.create(feedbackData);

    // Notify Admin

    await this._notificationService.notifyAdminNewFeedback(

      data.userId,
      data.userName,
    );

    return this._feedbackMapper.toResponseDto(feedback);
  }

  //Fetch feedback
  async getAllFeedback(
    page = 1,
    limit = 5,
    search = "",
  ): Promise<{ feedbacks: FeedbackResponseDTO[]; total: number }> {
    await this._feedbackRepo.repairFeedbackData();

    const query: FilterQuery<IFeedback> = {};
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
        { userType: { $regex: search, $options: "i" } },
      ];
    }

    const result = await this._feedbackRepo.findAll(query, page, limit);
    const total = await this._feedbackRepo.count(query);

    return {
      feedbacks: this._feedbackMapper.toResponseDtoList(result),
      total,
    };
  }

  //Single feedback
  async getFeedbackById(id: string): Promise<FeedbackResponseDTO | null> {
    const feedback = await this._feedbackRepo.findById(id);
    if (!feedback) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Feedback not found");
    }
    return this._feedbackMapper.toResponseDto(feedback);
  }

  //Updating
  async updateFeedback(
    id: string,
    data: FeedbackUpdateDTO,
  ): Promise<FeedbackResponseDTO | null> {
    const feedback = await this._feedbackRepo.update(id, data);
    if (!feedback) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Feedback not found");
    }
    return this._feedbackMapper.toResponseDto(feedback);
  }

  //Featured status feedaback
  async getFeaturedFeedback(): Promise<FeedbackResponseDTO[]> {
    await this._feedbackRepo.repairFeedbackData();
    const result = await this._feedbackRepo.getFeaturedFeedback();
    return this._feedbackMapper.toResponseDtoList(result);
  }

  //Public feedback fetching
  async getPublicFeedback(): Promise<FeedbackResponseDTO[]> {
    await this._feedbackRepo.repairFeedbackData();
    const result = await this._feedbackRepo.getPublicFeedback();
    return this._feedbackMapper.toResponseDtoList(result);
  }

  //Feedback delete
  async deleteFeedback(id: string): Promise<boolean> {
    const result = await this._feedbackRepo.delete(id);
    if (!result) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Feedback not found");
    }
    return result;
  }
}
