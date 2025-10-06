import { Request, Response } from "express";
import { IAdminCandidateService } from "../../interfaces/users/admin/IAdminCandidateService";
import { BlockCandidateDTO } from "../../dto/admin/candidate.dto";

export class AdminCandidateController {
  constructor(private candidateService: IAdminCandidateService) {}

  getAllCandidates = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await this.candidateService.getAllCandidates(
      page,
      limit,
      search,
    );
    res.json(result);
  };

  getCandidateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Candidate ID is required" });

    const candidate = await this.candidateService.getCandidateById(id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    res.json(candidate);
  };

  blockUnblockCandidate = async (req: Request, res: Response) => {
    try {
      const data: BlockCandidateDTO = req.body;
      const candidate = await this.candidateService.blockUnblockCandidate(data);
      res
        .status(200)
        .json({ candidate, message: "Status updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
