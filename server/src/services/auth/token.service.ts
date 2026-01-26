import jwt from "jsonwebtoken";
import { ITokenService } from "../../interfaces/auth/ITokenService";

const invalidatedTokens = new Set<string>();

export class TokenService implements ITokenService {
  private readonly _accessTokenSecret: string;
  private readonly _refreshTokenSecret: string;

  constructor() {
    const accessTokenSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must needed");
    }

    this._accessTokenSecret = accessTokenSecret;
    this._refreshTokenSecret = refreshTokenSecret;
  }

  generateAccessToken(payload: {
    id: string;
    email: string;
    role: "Candidate" | "Employer" | "Admin" | "Guest";
  }): string {
    return jwt.sign(payload, this._accessTokenSecret, { expiresIn: "10m" });
  }

  generateRefreshToken(payload: {
    id: string;
    email: string;
    role: "Candidate" | "Employer" | "Admin" | "Guest";
  }): string {
    return jwt.sign(payload, this._refreshTokenSecret, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): object {
    const decoded = jwt.verify(token, this._accessTokenSecret);
    return decoded as object;
  }

  verifyRefreshToken(token: string): object {
    const decoded = jwt.verify(token, this._refreshTokenSecret);
    return decoded as object;
  }

  isTokenInvalidated(token: string): boolean {
    return invalidatedTokens.has(token);
  }

  invalidateToken(token: string): void {
    invalidatedTokens.add(token);
  }
}
