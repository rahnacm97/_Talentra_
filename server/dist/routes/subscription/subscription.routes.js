"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employerSubscription_controller_1 = require("../../controllers/employer/employerSubscription.controller");
const employer_service_1 = require("../../services/employer/employer.service");
const subscription_repository_1 = require("../../repositories/subscription/subscription.repository");
const subscription_mapper_1 = require("../../mappers/subscription/subscription.mapper");
const employer_repository_1 = require("../../repositories/employer/employer.repository");
const invoice_service_1 = require("../../services/employer/invoice.service");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const router = (0, express_1.Router)();
//Dependencies
const subscriptionRepository = new subscription_repository_1.SubscriptionRepository();
const employerRepository = new employer_repository_1.EmployerRepository();
const subscriptionMapper = new subscription_mapper_1.SubscriptionMapper();
const invoiceService = new invoice_service_1.InvoiceService();
//Service with dependencies
const subscriptionService = new employer_service_1.SubscriptionService(subscriptionRepository, employerRepository, subscriptionMapper);
//Controller
const subscriptionController = new employerSubscription_controller_1.SubscriptionController(subscriptionService, subscriptionRepository, employerRepository, invoiceService);
//Routes
router.post("/create-order", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionController.createOrder);
router.post("/verify-payment", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionController.verifyPayment);
router.get("/history", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionController.getHistory);
router.get("/invoice/:subscriptionId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.EMPLOYER]), subscriptionController.downloadInvoice);
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map