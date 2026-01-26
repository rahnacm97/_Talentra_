import { Router } from "express";
import { SubscriptionController } from "../../controllers/employer/employerSubscription.controller";
import { SubscriptionService } from "../../services/employer/employer.service";
import { SubscriptionRepository } from "../../repositories/subscription/subscription.repository";
import { SubscriptionMapper } from "../../mappers/subscription/subscription.mapper";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
// import { InvoiceService } from "../../services/employer/invoice.service";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";

const router = Router();
const subscriptionMapper = new SubscriptionMapper();
const subscriptionRepository = new SubscriptionRepository();
const employerRepository = new EmployerRepository();
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  employerRepository,
  subscriptionMapper,
);
const invoiceService = { generateInvoice: () => ({ pipe: () => {}, end: () => {} }) };
const subscriptionController = new SubscriptionController(
  subscriptionService,
  subscriptionRepository,
  employerRepository,
  invoiceService as any,
);

router.post(
  "/create-order",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.createOrder.bind(subscriptionController),
);
router.post(
  "/verify-payment",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.verifyPayment.bind(subscriptionController),
);
router.get(
  "/history",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.getSubscriptionHistory.bind(subscriptionController),
);
router.get(
  "/invoice/:subscriptionId",
  verifyAuth([USER_ROLES.EMPLOYER]),
  subscriptionController.downloadInvoice.bind(subscriptionController),
);

export default router;
