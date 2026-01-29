"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../../controllers/notification/notification.controller");
const notification_service_1 = require("../../services/notification/notification.service");
const notification_repository_1 = require("../../repositories/notification/notification.repository");
const notification_mapper_1 = require("../../mappers/notification/notification.mapper");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const router = (0, express_1.Router)();
// Dependencies
const repository = new notification_repository_1.NotificationRepository();
const mapper = new notification_mapper_1.NotificationMapper();
const service = new notification_service_1.NotificationService(repository, mapper);
// Controller
const controller = new notification_controller_1.NotificationController(service);
// All roles
const ALL_ROLES = [enums_1.USER_ROLES.ADMIN, enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.CANDIDATE];
// Routes
router.get("/", (0, authMiddleware_1.verifyAuth)(ALL_ROLES), controller.getNotifications.bind(controller));
router.get("/stats", (0, authMiddleware_1.verifyAuth)(ALL_ROLES), controller.getStats.bind(controller));
router.patch("/:id/read", (0, authMiddleware_1.verifyAuth)(ALL_ROLES), controller.markAsRead.bind(controller));
router.patch("/read-all", (0, authMiddleware_1.verifyAuth)(ALL_ROLES), controller.markAllAsRead.bind(controller));
router.delete("/:id", (0, authMiddleware_1.verifyAuth)(ALL_ROLES), controller.deleteNotification.bind(controller));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map