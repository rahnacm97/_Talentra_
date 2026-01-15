import "express";
import { USER_ROLES } from "../../shared/enums/enums";

declare module "express-serve-static-core" {
  interface Request {
    user?: Express.User;
  }
}

declare global {
  namespace Express {
    interface User {
      _id: string;
      id: string;
      name: string;
      role: USER_ROLES;
      email: string;
      profileImage?: string;
      blocked?: boolean;
      subscription?: {
        active: boolean;
        plan: "free" | "professional" | "enterprise";
        status: string;
        currentPeriodEnd?: Date | null;
        razorpaySubscriptionId?: string | null;
        trialEndsAt?: Date | null;
      };
      maskApplications?: boolean;
    }
  }
}
