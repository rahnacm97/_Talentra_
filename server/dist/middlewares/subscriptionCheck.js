"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSubscription = void 0;
const enums_1 = require("../shared/enums/enums");
const employer_repository_1 = require("../repositories/employer/employer.repository");
const Subscription_model_1 = __importDefault(require("../models/Subscription.model"));
const requireActiveSubscription = async (req, res, next) => {
    try {
        const authenticatedReq = req;
        if (!authenticatedReq.user ||
            authenticatedReq.user.role !== enums_1.USER_ROLES.EMPLOYER) {
            return next();
        }
        // Fetch employer to check subscription
        const employerRepo = new employer_repository_1.EmployerRepository();
        const employer = await employerRepo.findById(authenticatedReq.user.id);
        if (!employer) {
            return res.status(401).json({
                success: false,
                message: "Employer not found",
            });
        }
        const now = new Date();
        // Check trial period
        const isTrialActive = employer.trialEndsAt && new Date(employer.trialEndsAt) > now;
        // Check subscription status
        let hasValidSubscription = false;
        if (employer.hasActiveSubscription) {
            const latestSubscription = await Subscription_model_1.default.findOne({
                employerId: employer._id,
                status: "active",
            }).sort({ endDate: -1 });
            if (latestSubscription) {
                const subscriptionEndDate = new Date(latestSubscription.endDate);
                if (subscriptionEndDate > now) {
                    hasValidSubscription = true;
                }
                else {
                    // Update subscription status to expired
                    await Subscription_model_1.default.findByIdAndUpdate(latestSubscription._id, {
                        status: "expired",
                    });
                    await employerRepo.updateOne(employer._id, {
                        hasActiveSubscription: false,
                        currentPlan: "free",
                    });
                }
            }
            else {
                await employerRepo.updateOne(employer._id, {
                    hasActiveSubscription: false,
                });
            }
        }
        if (hasValidSubscription || isTrialActive) {
            return next();
        }
        return res.status(403).json({
            success: false,
            message: "Subscription required",
            code: "SUBSCRIPTION_REQUIRED",
        });
    }
    catch (error) {
        console.error("Subscription check error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.requireActiveSubscription = requireActiveSubscription;
// export const checkPlanAccess = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const authenticatedReq = req as AuthenticatedRequest;
//     if (
//       !authenticatedReq.user ||
//       authenticatedReq.user.role !== USER_ROLES.EMPLOYER
//     ) {
//       return next();
//     }
//     const plan = authenticatedReq.user.currentPlan || "free";
//     if (req.method === "POST" && req.originalUrl.includes("/jobs")) {
//       if (plan === "free") {
//         const count = await JobModel.countDocuments({
//           employerId: authenticatedReq.user._id,
//           status: { $in: ["active", "draft", "closed", "all"] },
//         });
//         if (count >= 10) {
//           return res.status(HTTP_STATUS.FORBIDDEN).json({
//             success: false,
//             message:
//               "You've reached the free plan limit of 10 jobs. Upgrade to Professional to post more.",
//             upgradeRequired: true,
//             currentPlan: "free",
//             used: count,
//             limit: 10,
//           });
//         }
//       }
//     }
//     if (req.originalUrl.includes("/applications")) {
//       if (plan === "free") {
//         authenticatedReq.maskApplications = true;
//         if (req.method === "PATCH" || req.method === "PUT") {
//           return res.status(HTTP_STATUS.FORBIDDEN).json({
//             success: false,
//             message:
//               "Free plan users can only view applications. Upgrade to Professional to shortlist or contact candidates.",
//             upgradeRequired: true,
//           });
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     console.error("Subscription check error:", error);
//     return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: ERROR_MESSAGES.SERVER_ERROR,
//     });
//   }
// };
//# sourceMappingURL=subscriptionCheck.js.map