import { Request, Response } from "express";
import { IFeedbackService } from "../../interfaces/feedback/IFeedbackService";
import { IFeedbackController } from "../../interfaces/feedback/IFeedbackController";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { logger } from "../../shared/utils/logger";
import { SUCCESS_MESSAGES, USER_ROLES } from "../../shared/enums/enums";
import { FullyAuthenticatedRequest } from "../../type/types";

export class FeedbackController implements IFeedbackController {
  constructor(private readonly _feedbackService: IFeedbackService) {}
  //User submit feedback
  submitFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, name, role, profileImage } = (
        req as unknown as FullyAuthenticatedRequest
      ).user;
      const feedback = await this._feedbackService.submitFeedback({
        ...req.body,
        userId: id,
        userName: name,
        userAvatar: profileImage,
        userType: role === USER_ROLES.CANDIDATE ? "candidate" : "employer",
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Feedback submitted successfully",
        data: feedback,
      });
    } catch (error) {
      logger.error("Error submitting feedback:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to submit feedback",
      });
    }
  };
  //Fetch all feedback
  getAllFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const result = await this._feedbackService.getAllFeedback(
        page,
        limit,
        search,
      );
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.FEEDBACK_FETCHED,
        data: result.feedbacks,
        total: result.total,
      });
    } catch (error) {
      logger.error("Error fetching feedback:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch feedback",
      });
    }
  };
  //Update
  updateFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Feedback ID is required",
        });
        return;
      }
      const feedback = await this._feedbackService.updateFeedback(id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Feedback updated successfully",
        data: feedback,
      });
    } catch (error) {
      logger.error("Error moderating feedback:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update feedback",
      });
    }
  };
  //Fetching featured feedback
  getFeaturedFeedback = async (_req: Request, res: Response): Promise<void> => {
    try {
      const feedbacks = await this._feedbackService.getFeaturedFeedback();
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: feedbacks,
      });
    } catch (error) {
      logger.error("Error fetching featured feedback:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch featured feedback",
      });
    }
  };
  //Fetch public feedback
  getPublicFeedback = async (_req: Request, res: Response): Promise<void> => {
    try {
      const feedbacks = await this._feedbackService.getPublicFeedback();
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: feedbacks,
      });
    } catch (error) {
      logger.error("Error fetching public feedback:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch public feedback",
      });
    }
  };
  //Delete feedback
  deleteFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Feedback ID is required",
        });
        return;
      }
      await this._feedbackService.deleteFeedback(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Feedback deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting feedback:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete feedback",
      });
    }
  };
}
