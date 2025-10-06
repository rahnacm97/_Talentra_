import { Request, Response } from "express";
import { EmployerService } from "../../services/employer/employer.service";

const employerService = new EmployerService();

export class EmployerController {
  async getProfile(req: Request, res: Response) {
    try {
      const employerId = req.params.id;
      if (!employerId) {
        return res.status(400).json({ message: "Employer ID is required" });
      }
      const employer = await employerService.getEmployerById(employerId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      if (employer.blocked) {
        return res.status(403).json({ message: "Employer is blocked" });
      }
      return res.status(200).json(employer);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}