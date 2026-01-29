import { Request, Response, NextFunction } from "express";
import { USER_ROLES } from "../shared/enums/enums";
export type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        id: string;
        role: USER_ROLES;
        email: string;
        blocked?: boolean;
        hasActiveSubscription?: boolean;
        trialEndsAt?: Date | null;
        currentPlan?: "free" | "professional" | "enterprise";
    } | undefined;
    maskApplications?: boolean;
};
export declare const requireActiveSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=subscriptionCheck.d.ts.map