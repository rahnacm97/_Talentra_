
import { Router } from "express";
import { SubscriptionController } from "../../controllers/employer/employerSubscription.controller";
import { SubscriptionService } from "../../services/employer/employer.service";
import { SubscriptionRepository } from "../../repositories/subscription/subscription.repository";
import { SubscriptionMapper } from "../../mappers/subscription/subscription.mapper";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { InvoiceService } from "../../services/employer/invoice.service";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";

const router = Router();

//Dependencies
const subscriptionRepository = new SubscriptionRepository();
const employerRepository = new EmployerRepository();
const subscriptionMapper = new SubscriptionMapper();
const invoiceService = new InvoiceService();

//Service with dependencies
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  employerRepository,
  subscriptionMapper,
);

//Controller
const subscriptionController = new SubscriptionController(
  subscriptionService,
  subscriptionRepository,
  employerRepository,
  invoiceService,
);
//Routes
router.post(
  "/create-order",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.createOrder,
);

router.post(
  "/verify-payment",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.verifyPayment,
);

router.get(
  "/history",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.getHistory,
);

router.get(
  "/invoice/:subscriptionId",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.downloadInvoice,
);

export default router;
