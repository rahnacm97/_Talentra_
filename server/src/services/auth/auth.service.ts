import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import {
  IUserReader,
  IUserWriter,
} from "../../interfaces/auth/IAuthRepository";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { AuthSignupDTO, AuthLoginDTO } from "../../dto/auth/auth.dto";
import type { UserType } from "../../interfaces/auth/IAuthService";
import { detectUserByEmail } from "../../utils/user.utils";
import { ITokenService } from "../../interfaces/auth/ITokenService";

export class AuthService implements IAuthService {
  constructor(
    private repos: Record<UserType, IUserReader<any> & IUserWriter<any>>,
    private tokenService: ITokenService,
  ) {}

  private getRepository(userType: UserType) {
    const repo = this.repos[userType];
    if (!repo) throw new Error("Invalid user type");
    return repo;
  }

  async signup(data: AuthSignupDTO) {
    const repo = this.getRepository(data.userType);
    const existing = await repo.findByEmail(data.email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await repo.create({ ...data, password: hashedPassword });

    return {
      user,
      accessToken: this.tokenService.generateAccessToken({
        id: user._id,
        email: user.email,
        role: data.userType,
      }),
      refreshToken: this.tokenService.generateRefreshToken({
        id: user._id,
        email: user.email,
        role: data.userType,
      }),
    };
  }

  async login(data: AuthLoginDTO) {
    const detected = await detectUserByEmail(data.email, this.repos);
    if (!detected) throw new Error("User not found");

    const { user, userType: role } = detected;

    if (user.blocked) throw new Error("You have been blocked by the admin");
    if (!user.emailVerified) throw new Error("Please verify your email");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      user,
      role,
      accessToken: this.tokenService.generateAccessToken({
        id: user._id,
        email: user.email,
        role,
      }),
      refreshToken: this.tokenService.generateRefreshToken({
        id: user._id,
        email: user.email,
        role,
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const decoded = this.tokenService.verifyRefreshToken(refreshToken) as {
      id: string;
      email: string;
      role: UserType;
    };

    return this.tokenService.generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
  }

  async logout(refreshToken: string): Promise<void> {
  this.tokenService.invalidateToken(refreshToken);
}
}
