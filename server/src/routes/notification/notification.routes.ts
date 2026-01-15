import { Router } from "express";
import { NotificationController } from "../../controllers/notification/notification.controller";
import { NotificationService } from "../../services/notification/notification.service";
import { NotificationRepository } from "../../repositories/notification/notification.repository";
import { NotificationMapper } from "../../mappers/notification/notification.mapper";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";

const router = Router();

// Dependencies
const repository = new NotificationRepository();
const mapper = new NotificationMapper();
const service = new NotificationService(repository, mapper);
// Controller
const controller = new NotificationController(service);

// All roles
const ALL_ROLES = [USER_ROLES.ADMIN, USER_ROLES.EMPLOYER, USER_ROLES.CANDIDATE];

// Routes
router.get(
  "/",
  verifyAuth(ALL_ROLES),
  controller.getNotifications.bind(controller),
);

router.get(
  "/stats",
  verifyAuth(ALL_ROLES),
  controller.getStats.bind(controller),
);

router.patch(
  "/:id/read",
  verifyAuth(ALL_ROLES),
  controller.markAsRead.bind(controller),
);

router.patch(
  "/read-all",
  verifyAuth(ALL_ROLES),
  controller.markAllAsRead.bind(controller),
);

router.delete(
  "/:id",
  verifyAuth(ALL_ROLES),
  controller.deleteNotification.bind(controller),
);

export default router;
