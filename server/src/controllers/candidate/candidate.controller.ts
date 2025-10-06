import { Request, Response } from "express";
import { CandidateService } from "../../services/candidate/candidate.service";

const candidateService = new CandidateService();

export class CandidateController {
  async getProfile(req: Request, res: Response) {
    try {
      const candidateId = req.params.id;
      if (!candidateId) {
        return res.status(400).json({ message: "Candidate ID is required" });
      }
      const candidate = await candidateService.getCandidateById(candidateId);
      if (!candidate)
        return res.status(404).json({ message: "Candidate not found" });

      if (candidate.blocked) {
        return res.status(403).json({ message: "Candidate is blocked" });
      }
      return res.status(200).json(candidate);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
