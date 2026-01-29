"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const mongoose_1 = require("mongoose");
class FeedbackService {
    constructor(_feedbackRepo, _feedbackMapper, _notificationService) {
        this._feedbackRepo = _feedbackRepo;
        this._feedbackMapper = _feedbackMapper;
        this._notificationService = _notificationService;
    }
    //Feedback submission
    async submitFeedback(data) {
        const feedbackData = {
            userId: new mongoose_1.Types.ObjectId(data.userId),
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
        await this._notificationService.notifyAdminNewFeedback(data.userId, data.userName);
        return this._feedbackMapper.toResponseDto(feedback);
    }
    //Fetch feedback
    async getAllFeedback(page = 1, limit = 5, search = "") {
        await this._feedbackRepo.repairFeedbackData();
        const query = {};
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
    async getFeedbackById(id) {
        const feedback = await this._feedbackRepo.findById(id);
        if (!feedback) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Feedback not found");
        }
        return this._feedbackMapper.toResponseDto(feedback);
    }
    //Updating
    async updateFeedback(id, data) {
        const feedback = await this._feedbackRepo.update(id, data);
        if (!feedback) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Feedback not found");
        }
        return this._feedbackMapper.toResponseDto(feedback);
    }
    //Featured status feedaback
    async getFeaturedFeedback() {
        await this._feedbackRepo.repairFeedbackData();
        const result = await this._feedbackRepo.getFeaturedFeedback();
        return this._feedbackMapper.toResponseDtoList(result);
    }
    //Public feedback fetching
    async getPublicFeedback() {
        await this._feedbackRepo.repairFeedbackData();
        const result = await this._feedbackRepo.getPublicFeedback();
        return this._feedbackMapper.toResponseDtoList(result);
    }
    //Feedback delete
    async deleteFeedback(id) {
        const result = await this._feedbackRepo.delete(id);
        if (!result) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Feedback not found");
        }
        return result;
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map