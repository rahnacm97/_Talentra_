import { AuthLoginDTO, AuthSignupDTO } from "../../dto/auth/auth.dto";

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserType;
    blocked: boolean;
    emailVerified?: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserType;
    blocked: boolean;
    emailVerified?: boolean;
  };
}

export interface IAuthService {
  signup(data: AuthSignupDTO): Promise<AuthResponse>;
  login(data: AuthLoginDTO): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
  logout(refreshToken: string): Promise<void>;
}

export type UserType = "Candidate" | "Employer" | "Admin";
