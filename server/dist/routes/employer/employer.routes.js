"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employer_controller_1 = require("../../controllers/employer/employer.controller");
const employerAnalytics_controller_1 = require("../../controllers/employer/employerAnalytics.controller");
const employerApplication_controller_1 = require("../../controllers/employer/employerApplication.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const subscriptionCheck_1 = require("../../middlewares/subscriptionCheck");
const employer_service_1 = require("../../services/employer/employer.service");
const employer_mapper_1 = require("../../mappers/employer/employer.mapper");
const employer_repository_1 = require("../../repositories/employer/employer.repository");
const multer_1 = require("../../config/multer");
const job_routes_1 = __importDefault(require("../job/job.routes"));
const enums_1 = require("../../shared/enums/enums");
const application_service_1 = require("../../services/application/application.service");
const application_mapper_1 = require("../../mappers/application/application.mapper");
const application_repository_1 = require("../../repositories/application/application.repository");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
const interview_service_1 = require("../../services/interview/interview.service");
const interview_mapper_1 = require("../../mappers/interview/interview.mapper");
const employer_service_2 = require("../../services/employer/employer.service");
const job_repository_1 = require("../../repositories/job/job.repository");
const subscription_routes_1 = __importDefault(require("../subscription/subscription.routes"));
const chat_service_1 = require("../../services/chat/chat.service");
const chat_repository_1 = require("../../repositories/chat/chat.repository");
const chat_mapper_1 = require("../../mappers/chat/chat.mapper");
const chat_socket_1 = require("../../socket/chat.socket");
const notification_socket_1 = require("../../socket/notification.socket");
const NotificationAdapter_1 = require("../../services/notification/NotificationAdapter");
const router = (0, express_1.Router)();
//Dependencies
const employerMapper = new employer_mapper_1.EmployerMapper();
const employerRepository = new employer_repository_1.EmployerRepository();
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
const employerService = new employer_service_1.EmployerService(employerRepository, employerMapper, notificationAdapter);
const employerController = new employer_controller_1.EmployerController(employerService);
const applicationMapper = new application_mapper_1.EmployerApplicationMapper();
const applicationRepo = new application_repository_1.ApplicationRepository();
const interviewRepo = new interview_repository_1.InterviewRepository();
const interviewMapper = new interview_mapper_1.InterviewMapper();
const interviewService = new interview_service_1.InterviewService(interviewRepo, interviewMapper);
const mapper = new employer_mapper_1.EmployerAnalyticsMapper();
const jobRepo = new job_repository_1.JobRepository();
const chatRepository = new chat_repository_1.ChatRepository();
const chatMapper = new chat_mapper_1.ChatMapper();
const chatSocket = chat_socket_1.ChatSocket.getInstance();
const notificationSocket = notification_socket_1.NotificationSocket.getInstance();
const chatService = new chat_service_1.ChatService(chatRepository, applicationRepo, chatMapper, chatSocket, notificationSocket);
const employerApplicationService = new application_service_1.EmployerApplicationService(applicationRepo, applicationMapper, notificationAdapter, interviewService, chatService);
const analyticsRepository = new employer_repository_1.EmployerAnalyticsRepository(jobRepo, applicationRepo, interviewRepo);
const analyticsService = new employer_service_2.EmployerAnalyticsService(analyticsRepository, mapper);
//Controller
const employerApplicationsController = new employerApplication_controller_1.EmployerApplicationsController(employerApplicationService);
const analyticsController = new employerAnalytics_controller_1.EmployerAnalyticsController(analyticsService);
//Routes
router.use("/subscription", subscription_routes_1.default);
router.get("/analytics", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionCheck_1.requireActiveSubscription, analyticsController.getEmployerAnalytics.bind(analyticsController));
router.get("/profile", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), employerController.getProfile.bind(employerController));
router.put("/profile", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), multer_1.upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
]), employerController.updateProfile.bind(employerController));
router.get("/applications", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionCheck_1.requireActiveSubscription, employerApplicationsController.getApplications.bind(employerApplicationsController));
router.patch("/applications/:applicationId/status", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionCheck_1.requireActiveSubscription, employerApplicationsController.updateApplicationStatus.bind(employerApplicationsController));
router.use("/jobs", job_routes_1.default);
exports.default = router;
//# sourceMappingURL=employer.routes.js.map