// import { Request, Response } from "express";
// import { AuthService } from "../../services/auth/auth.service";
// import { CandidateRepository } from "../../repositories/candidate/candidate.repository";
// import { EmployerRepository } from "../../repositories/employer/employer.repository";
// import { AdminRepository } from "../../repositories/admin/admin.repository";

// const authService = new AuthService(
//   new CandidateRepository(),
//   new EmployerRepository(),
//   new AdminRepository()
// );

// export class AdminAuthController {
//   constructor(){
//     this.login = this.login.bind(this);
//   }

//   async login(req: Request, res: Response) {
//     try {
//       const { email, password } = req.body;
//       const result = await authService.login(email, password);

//       if (result.role !== "Admin") return res.status(403).json({ message: "Forbidden: Admin only" });

//       res.status(200).json({
//         message: "Admin login successful",
//         admin: { id: result.user._id, email: result.user.email, name: result.user.name },
//         accessToken: result.accessToken,
//         refreshToken: result.refreshToken,
//       });
//     } catch (error: any) {
//       res.status(400).json({ message: error.message });
//     }
//   }
// }


import { Request, Response } from "express";
import { AdminAuthService } from "../../services/admin/admin.authService";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";

export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const data: AdminLoginDTO = req.body;
      const result = await this.adminAuthService.login(data);

      res.status(200).json({
        message: "Admin login successful",
        admin: { id: result.admin._id, email: result.admin.email, name: result.admin.name },
        accessToken: result.token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
