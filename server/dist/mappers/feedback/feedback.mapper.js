"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackMapper = void 0;
class FeedbackMapper {
    toResponseDto(feedback) {
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
    toResponseDtoList(feedbacks) {
        return feedbacks.map((f) => this.toResponseDto(f));
    }
}
exports.FeedbackMapper = FeedbackMapper;
//# sourceMappingURL=feedback.mapper.js.map