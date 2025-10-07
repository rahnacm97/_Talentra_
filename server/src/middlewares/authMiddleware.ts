// import { Request, Response, NextFunction } from "express";
// import { TokenService } from "../services/auth/token.service";
// import { CandidateRepository } from "../repositories/candidate/candidate.repository";
// import { EmployerRepository } from "../repositories/employer/employer.repository";
// import { AdminRepository } from "../repositories/admin/admin.repository";

// const tokenService = new TokenService();

// export const verifyAuth =
//   (role: "Candidate" | "Employer" | "Admin") =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const authHeader = req.headers.authorization;
//       if (!authHeader?.startsWith("Bearer ")) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Unauthorized" });
//       }

//       const token = authHeader.split(" ")[1];
//       if (!token) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Token missing" });
//       }

//       const decoded = tokenService.verifyAccessToken(token) as {
//         id: string;
//         role: string;
//       };
//       if (decoded.role !== role) {
//         return res
//           .status(403)
//           .json({ success: false, message: "Forbidden - Invalid role" });
//       }

//       let user;
//       if (role === "Candidate") {
//         const candidateRepo = new CandidateRepository();
//         user = await candidateRepo.findById(decoded.id);

//         if (!user) {
//           return res
//             .status(401)
//             .json({ success: false, message: "Candidate not found" });
//         }

//         if (user.blocked) {
//           return res.status(403).json({
//             success: false,
//             message: "You have been blocked by admin",
//           });
//         }
//       } else if (role === "Employer") {
//         const employerRepo = new EmployerRepository();
//         user = await employerRepo.findById(decoded.id);

//         if (!user) {
//           return res
//             .status(401)
//             .json({ success: false, message: "Employer not found" });
//         }

//         if (user.blocked) {
//           return res.status(403).json({
//             success: false,
//             message: "You have been blocked by admin",
//           });
//         }
//       } else if (role === "Admin") {
//         const adminRepo = new AdminRepository();
//         user = await adminRepo.findById(decoded.id);

//         if (!user) {
//           return res
//             .status(401)
//             .json({ success: false, message: "Admin not found" });
//         }
//       }

//       req.user = { id: decoded.id, role: decoded.role };
//       next();
//     } catch (error: any) {
//       console.error("Auth Middleware Error:", error.message);
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid or expired token" });
//     }
//   };

import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/auth/token.service";
import { CandidateRepository } from "../repositories/candidate/candidate.repository";
import { EmployerRepository } from "../repositories/employer/employer.repository";
import { AdminRepository } from "../repositories/admin/admin.repository";

const tokenService = new TokenService();

export const verifyAuth =
  (roles: ("Candidate" | "Employer" | "Admin")[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
      }

      const decoded = tokenService.verifyAccessToken(token) as {
        id: string;
        role: "Candidate" | "Employer" | "Admin";
      };

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Invalid role",
        });
      }

      let user: any;

      if (decoded.role === "Candidate") {
        const candidateRepo = new CandidateRepository();
        user = await candidateRepo.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ success: false, message: "Candidate not found" });
        }

        if (user.blocked) {
          return res.status(403).json({
            success: false,
            message: "You have been blocked by admin",
          });
        }
      } else if (decoded.role === "Employer") {
        const employerRepo = new EmployerRepository();
        user = await employerRepo.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ success: false, message: "Employer not found" });
        }

        if (user.blocked) {
          return res.status(403).json({
            success: false,
            message: "You have been blocked by admin",
          });
        }
      } else if (decoded.role === "Admin") {
        const adminRepo = new AdminRepository();
        user = await adminRepo.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ success: false, message: "Admin not found" });
        }
      }

      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error: any) {
      console.error("Auth Middleware Error:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  };

