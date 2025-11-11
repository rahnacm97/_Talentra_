import bcrypt from "bcryptjs";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import type {
  RefreshTokenResponse,
  UserType,
} from "../../interfaces/auth/IAuthService";
import { detectUserByEmail } from "../../shared/utils/user.utils";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { UserRepoMap } from "../../types/types";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { hasEmailVerification } from "../../types/types";

export class AuthService implements IAuthService {
  constructor(
    private _repos: UserRepoMap,
    private _tokenService: ITokenService,
  ) {}

  private getRepository(userType: UserType) {
    const repo = this._repos[userType];
    if (!repo) throw new Error("Invalid user type");
    return repo;
  }

  async signup(data: AuthSignupDTO) {
    const detected = await detectUserByEmail(data.email, this._repos);
    if (detected) {
      throw new Error("Email already exists in another account");
    }

    const repo = this.getRepository(data.userType);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await repo.create({ ...data, password: hashedPassword });

    const blocked = hasEmailVerification(user) ? user.blocked : false;

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: data.userType,
        blocked,
        emailVerified: false,
        ...(data.userType === "Employer" && { verified: false }),
      },
      accessToken: this._tokenService.generateAccessToken({
        id: user._id,
        email: user.email,
        role: data.userType,
      }),
      refreshToken: this._tokenService.generateRefreshToken({
        id: user._id,
        email: user.email,
        role: data.userType,
      }),
    };
  }

  async login(data: AuthLoginDTO) {
    const detected = await detectUserByEmail(data.email, this._repos);
    if (!detected) throw new Error("User not found");

    const { user, userType: role } = detected;

    if (role === "Admin") {
      throw new Error("Admin login requires alternative authentication");
    }

    if (!user.password) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    if ((user as ICandidate | IEmployer).blocked) {
      throw new Error("You have been blocked by the admin");
    }

    if (!(user as ICandidate | IEmployer).emailVerified) {
      throw new Error("Please verify your email");
    }

    if (hasEmailVerification(user)) {
      if (user.blocked) {
        throw new Error("You have been blocked by the admin");
      }
      if (!user.emailVerified) {
        throw new Error("Please verify your email");
      }
    }

    const emailVerified = hasEmailVerification(user)
      ? user.emailVerified
      : false;
    const blocked = hasEmailVerification(user) ? user.blocked : false;

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
        blocked,
        emailVerified,
        ...(role === "Employer" && { verified: (user as IEmployer).verified }),
      },
      accessToken: this._tokenService.generateAccessToken({
        id: user._id,
        email: user.email,
        role,
      }),
      refreshToken: this._tokenService.generateRefreshToken({
        id: user._id,
        email: user.email,
        role,
      }),
    };
  }
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const decoded = this._tokenService.verifyRefreshToken(refreshToken) as {
      id: string;
      email: string;
      role: UserType;
    };

    if (this._tokenService.isTokenInvalidated(refreshToken)) {
      throw new Error("Token has been invalidated");
    }

    const repo = this.getRepository(decoded.role);
    const user = await repo.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    if (decoded.role !== "Admin" && (user as ICandidate | IEmployer).blocked) {
      throw new Error("You have been blocked by admin");
    }

    const newAccessToken = this._tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
      role: decoded.role,
    });

    return {
      accessToken: newAccessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: decoded.role,
        blocked:
          decoded.role !== "Admin"
            ? (user as ICandidate | IEmployer).blocked || false
            : false,
        ...(decoded.role === "Employer" && {
          verified: (user as IEmployer).verified,
        }),
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    this._tokenService.invalidateToken(refreshToken);
  }
}
