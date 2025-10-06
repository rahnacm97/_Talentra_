import jwt from "jsonwebtoken";
import { ITokenService } from "../../interfaces/auth/ITokenService";

export class TokenService implements ITokenService {
  generateAccessToken(payload: object): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    return jwt.sign(payload, secret, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: object): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
    return jwt.sign(payload, secret, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    return jwt.verify(token, secret);
  }

  verifyRefreshToken(token: string) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
    return jwt.verify(token, secret);
  }
}


