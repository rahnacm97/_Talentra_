import { IUserReader, IUserWriter } from "../interfaces/auth/IAuthRepository";
import { UserType } from "../interfaces/auth/IAuthService";

export async function detectUserByEmail(
  email: string,
  repos: Record<UserType, IUserReader<any> & IUserWriter<any>>
) {
  for (const [userType, repo] of Object.entries(repos) as [UserType, IUserReader<any> & IUserWriter<any>][]) {
    const user = await repo.findByEmail(email);
    if (user) {
      return { user, userType };
    }
  }
  return null;
}
