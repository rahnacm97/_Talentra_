import { ICandidate } from "../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../interfaces/users/employer/IEmployer";
import { IAdmin } from "../interfaces/users/admin/IAdmin";
import { IUserReader, IUserWriter } from "../interfaces/auth/IAuthRepository";
import { Document } from "mongoose";
import { IUserRepository } from "../interfaces/auth/IAuthRepository";

export type UserRepoMap = {
  Candidate: IUserRepository<ICandidate>;
  Employer: IUserRepository<IEmployer>;
  Admin: IUserRepository<IAdmin>;
};

export type UserType = "Candidate" | "Employer" | "Admin";

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserType;
  emailVerified: boolean;
  blocked: boolean;
}

export type AnyUser = User | ICandidate | IEmployer | IAdmin;

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

// export function isVerifiableUser(user: AnyUser): user is VerifiableUser {
//   return ["Candidate", "Employer"].includes((user as any).role || "");
// }

export function hasEmailVerification(
  user: AnyUser,
): user is ICandidate | IEmployer {
  return user && "emailVerified" in user;
}
