import { AuthLoginDTO, AuthSignupDTO } from "../../dto/auth/auth.dto";

export interface IAuthService {
  signup(data: AuthSignupDTO): Promise<any>;
  login(data: AuthLoginDTO): Promise<any>;
  refreshToken(refreshToken: string): Promise<string>;
  logout(refreshToken: string): Promise<void>;

}
export type UserType = "Candidate" | "Employer" | "Admin";