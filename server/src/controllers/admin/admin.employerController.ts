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

  getEmployerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Employer ID is required" });

  const employer = await this.employerService.getEmployerById(id);
  if (!employer) return res.status(404).json({ message: "Employer not found" });

  res.json(employer);
};

  blockUnblockEmployer = async (req: Request, res: Response) => {
   try {
    const data: BlockEmployerDTO = req.body;
    const employer = await this.employerService.blockUnblockEmployer(data);
    res
      .status(200)
      .json({ employer, message: "Status updated successfully" });
   } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
  };
}
