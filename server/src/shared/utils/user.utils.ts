import {
  IUserReader,
  IUserWriter,
} from "../../interfaces/auth/IAuthRepository";
import { AnyUser, UserType } from "../../type/types";
import { GoogleAuthUserRepoMap, GoogleAuthUser } from "../../type/types";

export async function detectUserByEmail(
  email: string,
  repos: Record<UserType, IUserReader<AnyUser> & IUserWriter<AnyUser>>,
) {
  for (const userType of Object.keys(repos) as UserType[]) {
    const repo = repos[userType];
    const user = await repo.findByEmail(email);
    if (user) {
      return { user, userType };
    }
  }
  return null;
}

export async function detectUserByEmailForGoogle(
  email: string,
  repos: GoogleAuthUserRepoMap,
): Promise<{
  user: GoogleAuthUser;
  userType: "Candidate" | "Employer";
} | null> {
  const candidate = await repos.Candidate.findByEmail(email);
  if (candidate) {
    return { user: candidate, userType: "Candidate" };
  }

  const employer = await repos.Employer.findByEmail(email);
  if (employer) {
    return { user: employer, userType: "Employer" };
  }

  return null;
}
