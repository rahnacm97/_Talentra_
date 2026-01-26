import { ICandidate } from "../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../interfaces/users/employer/IEmployer";
import { IAdmin } from "../interfaces/users/admin/IAdmin";
import { IUserReader, IUserWriter } from "../interfaces/auth/IAuthRepository";
import { Document } from "mongoose";
import { IUserRepository } from "../interfaces/auth/IAuthRepository";
import { USER_ROLES } from "../shared/enums/enums";

export type UserRepoMap = {
  Candidate: IUserRepository<ICandidate>;
  Employer: IUserRepository<IEmployer>;
  Admin: IUserRepository<IAdmin>;
};

export type UserType = "Candidate" | "Employer" | "Admin";

export interface IUserEntity extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserType;
  emailVerified: boolean;
  blocked: boolean;
}

export interface IAuthenticatedUser {
  id: string;
  _id: string;
  role: USER_ROLES;
  email: string;
  name: string;
  profileImage?: string;
  blocked?: boolean;
  hasActiveSubscription?: boolean;
  trialEndsAt?: Date | null;
  subscription?: {
    active: boolean;
    plan: "free" | "professional" | "enterprise";
    status: string;
    currentPeriodEnd?: Date | null;
    razorpaySubscriptionId?: string | null;
    trialEndsAt?: Date | null;
  };
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IAuthenticatedUser {}
    interface Request {
      maskApplications?: boolean;
    }
  }
}

export type FullyAuthenticatedRequest = Request & {
  user: IAuthenticatedUser;
};

export type AnyUser = IUserEntity | ICandidate | IEmployer | IAdmin;

export type GoogleAuthUser = ICandidate | IEmployer;

export interface GoogleAuthUserData {
  _id: string;
  email: string;
  name: string;
  role: UserType;
}

export type GoogleAuthUserRepoMap = {
  Candidate: IUserReader<ICandidate> & IUserWriter<ICandidate>;
  Employer: IUserReader<IEmployer> & IUserWriter<IEmployer>;
};

export type VerifiableUser = ICandidate | IEmployer;

export function hasEmailVerification(
  user: AnyUser,
): user is ICandidate | IEmployer {
  return user && "emailVerified" in user;
}
