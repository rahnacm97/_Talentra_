import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

// Extend Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const roleMiddleware =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // ✅ Ensure secret is string and exists
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      // ✅ Use `unknown` first, then narrow
      const decoded = jwt.verify(token, secret) as unknown;

      if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("id" in decoded) ||
        !("role" in decoded)
      ) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      const user = decoded as DecodedToken;

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token" });
    }
  };



