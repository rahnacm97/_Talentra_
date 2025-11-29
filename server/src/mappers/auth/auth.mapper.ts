import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import {
  AuthResponse,
  RefreshTokenResponse,
  UserType,
} from "../../interfaces/auth/IAuthService";
import { IAuthMapper } from "../../interfaces/auth/IAuthMapper";
import { hasEmailVerification } from "../../type/types";

export class AuthMapper implements IAuthMapper {
  toAuthResponse(
    user: ICandidate | IEmployer | IAdmin,
    role: UserType,
  ): AuthResponse["user"] {
    const blocked = hasEmailVerification(user) ? user.blocked : false;
    const emailVerified = hasEmailVerification(user)
      ? user.emailVerified
      : false;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
      blocked,
      emailVerified,
    };
  }

  toRefreshTokenResponse(
    user: ICandidate | IEmployer | IAdmin,
    role: UserType,
  ): RefreshTokenResponse["user"] {
    const blocked = hasEmailVerification(user) ? user.blocked : false;
    const emailVerified = hasEmailVerification(user)
      ? user.emailVerified
      : false;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
      blocked,
      emailVerified,
    };
  }

  toSignupEntity(dto: AuthSignupDTO): Partial<ICandidate | IEmployer | IAdmin> {
    return {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      emailVerified: dto.emailVerified ?? false,
    };
  }

  toLoginEntity(dto: AuthLoginDTO): { email: string; password: string } {
    return {
      email: dto.email,
      password: dto.password,
    };
  }
}
