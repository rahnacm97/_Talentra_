import { Request, Response, NextFunction } from "express";
import { USER_ROLES } from "../shared/enums/enums";
<<<<<<< Updated upstream
import { HTTP_STATUS } from "../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../shared/enums/enums";
=======
import { EmployerRepository } from "../repositories/employer/employer.repository";
import Subscription from "../models/Subscription.model";
>>>>>>> Stashed changes

export type AuthenticatedRequest = Request & {
  user?: {
    _id: string;
    id: string;
    role: USER_ROLES;
    email: string;
    blocked?: boolean;
    subscription?: {
      active: boolean;
      plan: "free" | "professional" | "enterprise";
      status: string;
      currentPeriodEnd?: Date | null;
      razorpaySubscriptionId?: string | null;
      trialEndsAt?: Date | null;
    };
  };
  maskApplications?: boolean;
};

export const checkPlanAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || req.user.role !== USER_ROLES.EMPLOYER) {
      return next();
    }

    const plan = req.user.subscription?.plan || "free";

    if (req.method === "POST" && req.originalUrl.includes("/jobs")) {
      if (plan === "free") {
        const count = await JobModel.countDocuments({
          employerId: req.user._id,
          status: { $in: ["active", "draft", "closed", "all"] },
        });

        if (count >= 10) {
          return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message:
              "You've reached the free plan limit of 10 jobs. Upgrade to Professional to post more.",
            upgradeRequired: true,
            currentPlan: "free",
            used: count,
            limit: 10,
          });
        }
      }
    }

    // APPLICATIONS: MASK + BLOCK ACTIONS
    if (req.originalUrl.includes("/applications")) {
      if (plan === "free") {
        req.maskApplications = true;

        if (req.method === "PATCH" || req.method === "PUT") {
          return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message:
              "Free plan users can only view applications. Upgrade to Professional to shortlist or contact candidates.",
            upgradeRequired: true,
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
