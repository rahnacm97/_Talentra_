// import { Request, Response } from "express";
// import { AdminEmployerService } from "../../services/admin/admin.employerService";
// import { EmployerRepository } from "../../repositories/employer/employer.repository";

// const adminEmployerService = new AdminEmployerService(new EmployerRepository());

// export class AdminEmployerController {
// //   async getAllEmployers(req: Request, res: Response) {
// //     try {
// //       const { page = 1, limit = 10, search = "" } = req.query;
// //       const result = await adminEmployerService.getAllEmployers(
// //         Number(page),
// //         Number(limit),
// //         String(search)
// //       );
// //       res.status(200).json(result);
// //     } catch (error: any) {
// //       res.status(400).json({ message: error.message });
// //     }
// //   }

//     async getAllEmployers(req: Request, res: Response) {
//         try {
//             const page = Number(req.query.page) || 1;
//             const limit = Number(req.query.limit) || 10;
//             const search = String(req.query.search || "");

//             if (page <= 0 || limit <= 0) {
//             return res.status(400).json({ message: "Page and limit must be positive numbers" });
//             }

//             const result = await adminEmployerService.getAllEmployers(page, limit, search);
//             res.status(200).json(result);
//         } catch (error: any) {
//             res.status(400).json({ message: error.message });
//         }
//     }


//   async blockUnblockEmployer(req: Request, res: Response) {
//     try {
//       const result = await adminEmployerService.blockUnblockEmployer(req.body);
//       res.status(200).json({ message: `Employer ${result.blocked ? "blocked" : "unblocked"} successfully`, employer: result });
//     } catch (error: any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async getEmployerById(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       if (!id) return res.status(400).json({ message: "Employer ID is required" });

//       const result = await adminEmployerService.getEmployerById(id);
//       if (!result) return res.status(404).json({ message: "Employer not found" });

//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({ message: error.message });
//     }
//   }
// }


import { Request, Response } from "express";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { BlockEmployerDTO } from "../../dto/admin/employer.dto";

export class AdminEmployerController {
  constructor(private employerService: IAdminEmployerService) {}

  getAllEmployers = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await this.employerService.getAllEmployers(page, limit, search);
    res.json(result);
  };

  // getEmployerById = async (req: Request, res: Response) => {
  //   const employer = await this.employerService.getEmployerById(req.params.id);
  //   if (!employer) return res.status(404).json({ message: "Employer not found" });
  //   res.json(employer);
  // };

  getEmployerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Employer ID is required" });

  const employer = await this.employerService.getEmployerById(id);
  if (!employer) return res.status(404).json({ message: "Employer not found" });

  res.json(employer);
};

  blockUnblockEmployer = async (req: Request, res: Response) => {
    const data: BlockEmployerDTO = req.body;
    const updated = await this.employerService.blockUnblockEmployer(data);
    res.json(updated);
  };
}
