// import { AuthUser } from "@/middlewares/authMiddleware";

// declare namespace Express {
//   export interface Request {
//     user:AuthUser & {
//       role:string
//     }
//   }
// }

// import { USER_ROLES } from "../shared/enums/enums";

// declare global {
//   namespace Express {
//     interface Request {
//       user: {
//         _id: string;
//         id: string;
//         role: USER_ROLES;
//         email: string;
//         blocked?: boolean;
//         subscription?: {
//           active: boolean;
//           plan: "free" | "professional" | "enterprise";
//           status: string;
//           currentPeriodEnd?: Date | null;
//           razorpaySubscriptionId?: string | null;
//           trialEndsAt?: Date | null;
//         };
//       };
//       maskApplications?: boolean;
//     }
//   }
// }

// export {};

// src/types/express.ts
// import { USER_ROLES } from "../shared/enums/enums";

// export interface AuthUser {
//   _id: string;
//   id: string;
//   role: USER_ROLES;
//   email: string;
//   blocked?: boolean;
//   subscription?: {
//     active: boolean;
//     plan: "free" | "professional" | "enterprise";
//     status: string;
//     currentPeriodEnd?: Date | null;
//     razorpaySubscriptionId?: string | null;
//     trialEndsAt?: Date | null;
//   };
// }

// declare module "express-serve-static-core" {
//   interface Request {
//     user: AuthUser;
//     maskApplications?: boolean;
//   }
// }