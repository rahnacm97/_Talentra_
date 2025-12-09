import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/auth/token.service";
import { CandidateRepository } from "../repositories/candidate/candidate.repository";
import { EmployerRepository } from "../repositories/employer/employer.repository";
import { AdminRepository } from "../repositories/admin/admin.repository";
import { ERROR_MESSAGES } from "../shared/enums/enums";
import { HTTP_STATUS } from "../shared/httpStatus/httpStatusCode";
import { ICandidate } from "../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../interfaces/users/employer/IEmployer";
import { IAdmin } from "../interfaces/users/admin/IAdmin";
import { USER_ROLES } from "../shared/enums/enums";

const tokenService = new TokenService();

export type AuthUser = ICandidate | IEmployer | IAdmin;

export const verifyAuth =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ success: false, message: ERROR_MESSAGES.NOT_AUTHENTICATED });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      const decoded = tokenService.verifyAccessToken(token) as {
        id: string;
        role: string;
        email: string;
      };

      if (!roles.includes(decoded.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.NOT_AUTHENTICATED,
        });
      }

      let user: AuthUser | null = null;

      if (decoded.role === USER_ROLES.CANDIDATE) {
        const candidateRepo = new CandidateRepository();
        user = await candidateRepo.findById(decoded.id);
      } else if (decoded.role === USER_ROLES.EMPLOYER) {
        const employerRepo = new EmployerRepository();
        user = await employerRepo.findById(decoded.id);
      } else if (decoded.role === USER_ROLES.ADMIN) {
        const adminRepo = new AdminRepository();
        user = await adminRepo.findById(decoded.id);
      }

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.NOT_AUTHENTICATED,
        });
      }

      if (
        decoded.role !== USER_ROLES.ADMIN &&
        "blocked" in user &&
        user.blocked
      ) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.USER_BLOCKED,
        });
      }

      req.user = {
        id: user._id.toString(),
        _id: user._id.toString(),
        role: decoded.role as USER_ROLES,
        email: decoded.email,
        blocked: "blocked" in user ? user.blocked : false,
        ...(decoded.role === USER_ROLES.EMPLOYER && {
          hasActiveSubscription: (user as IEmployer).hasActiveSubscription,
          trialEndsAt: (user as IEmployer).trialEndsAt,
        }),
      };

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, message: ERROR_MESSAGES.NOT_AUTHENTICATED });
    }
  };

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next();
    }

    const decoded = tokenService.verifyAccessToken(token) as {
      id: string;
      role: string;
      email: string;
    };

    let user: AuthUser | null = null;

    if (decoded.role === USER_ROLES.CANDIDATE) {
      const candidateRepo = new CandidateRepository();
      user = await candidateRepo.findById(decoded.id);
    } else if (decoded.role === USER_ROLES.EMPLOYER) {
      const employerRepo = new EmployerRepository();
      user = await employerRepo.findById(decoded.id);
    } else if (decoded.role === USER_ROLES.ADMIN) {
      const adminRepo = new AdminRepository();
      user = await adminRepo.findById(decoded.id);
    }

    if (user) {
      const isBlocked =
        decoded.role !== USER_ROLES.ADMIN && "blocked" in user && user.blocked;

      if (!isBlocked) {
        req.user = {
          id: user._id.toString(),
          _id: user._id.toString(),
          role: decoded.role as USER_ROLES,
          email: decoded.email,
          blocked: "blocked" in user ? user.blocked : false,
          ...(decoded.role === USER_ROLES.EMPLOYER && {
            hasActiveSubscription: (user as IEmployer).hasActiveSubscription,
            trialEndsAt: (user as IEmployer).trialEndsAt,
          }),
        };
      }
    }
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};
