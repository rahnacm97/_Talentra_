"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_controller_1 = require("../../controllers/feedback/feedback.controller");
const feedback_service_1 = require("../../services/feedback/feedback.service");
const feedback_repository_1 = require("../../repositories/feedback/feedback.repository");
const feedback_mapper_1 = require("../../mappers/feedback/feedback.mapper");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const NotificationAdapter_1 = require("../../services/notification/NotificationAdapter");
const router = (0, express_1.Router)();
//Dependencies
const feedbackRepo = new feedback_repository_1.FeedbackRepository();
const feedbackMapper = new feedback_mapper_1.FeedbackMapper();
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
const feedbackService = new feedback_service_1.FeedbackService(feedbackRepo, feedbackMapper, notificationAdapter);
const feedbackController = new feedback_controller_1.FeedbackController(feedbackService);
// Public routes
router.get("/public", feedbackController.getPublicFeedback);
router.get("/featured", feedbackController.getFeaturedFeedback);
// User routes
router.post("/", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE, enums_1.USER_ROLES.EMPLOYER]), feedbackController.submitFeedback);
// Admin routes
router.get("/admin", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.ADMIN]), feedbackController.getAllFeedback);
router.patch("/admin/:id", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.ADMIN]), feedbackController.updateFeedback);
router.delete("/admin/:id", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.ADMIN]), feedbackController.deleteFeedback);
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map