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

export class AuthService implements IAuthService {
  constructor(
    private repos: Record<UserType, IUserReader<any> & IUserWriter<any>>,
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
      accessToken: this.generateAccessToken(
        user._id,
        user.email,
        data.userType,
      ),
      refreshToken: this.generateRefreshToken(
        user._id,
        user.email,
        data.userType,
      ),
    };
  }

  async login(data: AuthLoginDTO) {
    const detected = await detectUserByEmail(data.email, this.repos);
    if (!detected) throw new Error("User not found");

    const { user, userType: role } = detected;

    if (!user.emailVerified)
      throw new Error("Please verify your email before logging in");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      user,
      role,
      accessToken: this.generateAccessToken(user._id, user.email, role),
      refreshToken: this.generateRefreshToken(user._id, user.email, role),
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new Error("Refresh token required");

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET not defined");

    const decoded = jwt.verify(refreshToken, secret as Secret) as {
      id: string;
      email: string;
      role: UserType;
    };

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET as Secret,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || "1h" } as SignOptions,
    );

    return newAccessToken;
  }

  private generateAccessToken(id: string, email: string, role: UserType) {
    const secret: Secret = process.env.JWT_SECRET!;
    const expiresIn: string = process.env.JWT_ACCESS_EXPIRY || "1h";

    const options: SignOptions = { expiresIn };
    return jwt.sign({ id, email, role }, secret, options);
  }

  private generateRefreshToken(id: string, email: string, role: UserType) {
    const secret: Secret = process.env.JWT_REFRESH_SECRET!;
    const expiresIn: string = process.env.JWT_REFRESH_EXPIRY || "7d";

    const options: SignOptions = { expiresIn };
    return jwt.sign({ id, email, role }, secret, options);
  }
}
