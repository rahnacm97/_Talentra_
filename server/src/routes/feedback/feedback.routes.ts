import { Router } from "express";
import { FeedbackController } from "../../controllers/feedback/feedback.controller";
import { FeedbackService } from "../../services/feedback/feedback.service";
import { FeedbackRepository } from "../../repositories/feedback/feedback.repository";
import { FeedbackMapper } from "../../mappers/feedback/feedback.mapper";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";
import { NotificationAdapter } from "../../services/notification/NotificationAdapter";


const router = Router();
//Dependencies
const feedbackRepo = new FeedbackRepository();
const feedbackMapper = new FeedbackMapper();

const notificationAdapter = new NotificationAdapter();
const feedbackService = new FeedbackService(
  feedbackRepo,
  feedbackMapper,
  notificationAdapter,
);

const feedbackController = new FeedbackController(feedbackService);

// Public routes
router.get("/public", feedbackController.getPublicFeedback);
router.get("/featured", feedbackController.getFeaturedFeedback);

// User routes
router.post(
  "/",
  verifyAuth([USER_ROLES.CANDIDATE, USER_ROLES.EMPLOYER]),
  feedbackController.submitFeedback,
);

// Admin routes
router.get(
  "/admin",
  verifyAuth([USER_ROLES.ADMIN]),
  feedbackController.getAllFeedback,
);
router.patch(
  "/admin/:id",
  verifyAuth([USER_ROLES.ADMIN]),
  feedbackController.updateFeedback,
);
router.delete(
  "/admin/:id",
  verifyAuth([USER_ROLES.ADMIN]),
  feedbackController.deleteFeedback,
);

export default router;
