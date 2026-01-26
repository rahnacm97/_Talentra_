<<<<<<< Updated upstream
// import { Router } from "express";
// import { SubscriptionController } from "../../controllers/subscription/subscription.controller";
// import { SubscriptionService } from "../../services/subscription/subscription.service";
// import { SubscriptionRepository } from "../../repositories/subscription/subscription.repository";
// import { verifyAuth } from "../../middlewares/authMiddleware";
// import { USER_ROLES } from "../../shared/enums/enums";
=======
import { Router } from "express";
import { SubscriptionController } from "../../controllers/employer/employerSubscription.controller";
import { SubscriptionService } from "../../services/employer/employer.service";
import { SubscriptionRepository } from "../../repositories/subscription/subscription.repository";
import { SubscriptionMapper } from "../../mappers/subscription/subscription.mapper";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { InvoiceService } from "../../services/employer/invoice.service";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";
>>>>>>> Stashed changes

// const router = Router();
// const subscriptionRepository = new SubscriptionRepository();
// const subscriptionService = new SubscriptionService(subscriptionRepository);
// const subscriptionController = new SubscriptionController(subscriptionService);

// router.post("/create", verifyAuth([USER_ROLES.EMPLOYER]), subscriptionController.createSubscription.bind(subscriptionController));
// router.post("/verify", verifyAuth([USER_ROLES.EMPLOYER]), subscriptionController.verifyPayment.bind(subscriptionController));

// export default router;
