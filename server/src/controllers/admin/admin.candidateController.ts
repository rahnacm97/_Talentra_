// import { Request, Response } from "express";
// import { AdminCandidateService } from "../../services/admin/admin.candidateService";
// import { CandidateRepository } from "../../repositories/candidate/candidate.repository";

// const adminCandidateService = new AdminCandidateService(new CandidateRepository());

// export class AdminCandidateController {
//   async getAllCandidates(req: Request, res: Response) {
//     try {
//       const { page = 1, limit = 10, search = "" } = req.query;
//       const result = await adminCandidateService.getAllCandidates(Number(page), Number(limit), String(search));
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async blockUnblockCandidate(req: Request, res: Response) {
//     try {
//       const result = await adminCandidateService.blockUnblockCandidate(req.body);
//       res.status(200).json({ message: `Candidate ${result.blocked ? "blocked" : "unblocked"} successfully`, candidate: result });
//     } catch (error: any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   async getCandidateById(req: Request, res: Response) {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ message: "Candidate ID is required" });
//     }

//     const result = await adminCandidateService.getCandidateById(id);
//     if (!result) return res.status(404).json({ message: "Candidate not found" });

//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// }

// }


import { Request, Response } from "express";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { BlockCandidateDTO } from "../../dto/admin/candidate.dto";

export class AdminCandidateController {
  constructor(private candidateService: IAdminCandidateService) {}

  getAllCandidates = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await this.candidateService.getAllCandidates(page, limit, search);
    res.json(result);
  };

  // getCandidateById = async (req: Request, res: Response) => {
  //   const candidate = await this.candidateService.getCandidateById(req.params.id);
  //   if (!candidate) return res.status(404).json({ message: "Candidate not found" });
  //   res.json(candidate);
  // };

  getCandidateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Candidate ID is required" });

  const candidate = await this.candidateService.getCandidateById(id);
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  res.json(candidate);
};


  blockUnblockCandidate = async (req: Request, res: Response) => {
    const data: BlockCandidateDTO = req.body;
    const updated = await this.candidateService.blockUnblockCandidate(data);
    res.json(updated);
  };
}
