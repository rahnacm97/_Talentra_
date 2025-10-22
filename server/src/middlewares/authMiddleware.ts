import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/auth/token.service";
import { CandidateRepository } from "../repositories/candidate/candidate.repository";
import { EmployerRepository } from "../repositories/employer/employer.repository";
import { AdminRepository } from "../repositories/admin/admin.repository";
import { ERROR_MESSAGES } from "../shared/constants/constants";
import { HTTP_STATUS } from "../shared/httpStatus/httpStatus";
import { ICandidate } from "../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../interfaces/users/employer/IEmployer";
import { IAdmin } from "../interfaces/users/admin/IAdmin";

const tokenService = new TokenService();

type UserRole = "Candidate" | "Employer" | "Admin";
type AuthUser = ICandidate | IEmployer | IAdmin;

export const verifyAuth =
  (roles: UserRole[]) =>
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
        role: UserRole;
        email: string;
      };

      if (!roles.includes(decoded.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.NOT_AUTHENTICATED,
        });
      }

      let user: AuthUser | null = null;

      if (decoded.role === "Candidate") {
        const candidateRepo = new CandidateRepository();
        user = await candidateRepo.findById(decoded.id);
      } else if (decoded.role === "Employer") {
        const employerRepo = new EmployerRepository();
        user = await employerRepo.findById(decoded.id);
      } else if (decoded.role === "Admin") {
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
        decoded.role !== "Admin" &&
        (user as ICandidate | IEmployer).blocked
      ) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.USER_BLOCKED,
        });
      }

      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error: unknown) {
      console.error("Auth middleware error:", error);
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, message: ERROR_MESSAGES.NOT_AUTHENTICATED });
    }
  };
