"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
const enums_1 = require("../../shared/enums/enums");
class FeedbackController {
    constructor(_feedbackService) {
        this._feedbackService = _feedbackService;
        //User submit feedback
        this.submitFeedback = async (req, res) => {
            try {
                const { id, name, role, profileImage } = req.user;
                const feedback = await this._feedbackService.submitFeedback({
                    ...req.body,
                    userId: id,
                    userName: name,
                    userAvatar: profileImage,
                    userType: role === enums_1.USER_ROLES.CANDIDATE ? "candidate" : "employer",
                });
                res.status(httpStatusCode_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: "Feedback submitted successfully",
                    data: feedback,
                });
            }
            catch (error) {
                logger_1.logger.error("Error submitting feedback:", error);
                res.status(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to submit feedback",
                });
            }
        };
        //Fetch all feedback
        this.getAllFeedback = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const result = await this._feedbackService.getAllFeedback(page, limit, search);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    message: enums_1.SUCCESS_MESSAGES.FEEDBACK_FETCHED,
                    data: result.feedbacks,
                    total: result.total,
                });
            }
            catch (error) {
                logger_1.logger.error("Error fetching feedback:", error);
                res.status(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to fetch feedback",
                });
            }
        };
        //Update
        this.updateFeedback = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: "Feedback ID is required",
                    });
                    return;
                }
                const feedback = await this._feedbackService.updateFeedback(id, req.body);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Feedback updated successfully",
                    data: feedback,
                });
            }
            catch (error) {
                logger_1.logger.error("Error moderating feedback:", error);
                res.status(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to update feedback",
                });
            }
        };
        //Fetching featured feedback
        this.getFeaturedFeedback = async (_req, res) => {
            try {
                const feedbacks = await this._feedbackService.getFeaturedFeedback();
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    success: true,
                    data: feedbacks,
                });
            }
            catch (error) {
                logger_1.logger.error("Error fetching featured feedback:", error);
                res.status(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to fetch featured feedback",
                });
            }
        };
        //Fetch public feedback
        this.getPublicFeedback = async (_req, res) => {
            try {
                const feedbacks = await this._feedbackService.getPublicFeedback();
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    success: true,
                    data: feedbacks,
                });
            }
            catch (error) {
                logger_1.logger.error("Error fetching public feedback:", error);
                res.status(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to fetch public feedback",
                });
            }
        };
        //Delete feedback
        this.deleteFeedback = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: "Feedback ID is required",
                    });
                    return;
                }
                await this._feedbackService.deleteFeedback(id);
                res.status(httpStatusCode_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Feedback deleted successfully",
                });
            }
            catch (error) {
                logger_1.logger.error("Error deleting feedback:", error);
                res.status(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to delete feedback",
                });
            }
        };
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map