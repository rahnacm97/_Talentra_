import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { BlockEmployerDTO, EmployerResponseDTO } from "../../dto/admin/employer.dto";

export class AdminEmployerService implements IAdminEmployerService {
  constructor(private employerRepo: EmployerRepository) {}

  async getAllEmployers(page: number, limit: number, search?: string): Promise<{ data: EmployerResponseDTO[]; total: number }> {
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employers = await this.employerRepo.findAll(query, page, limit);
    const total = await this.employerRepo.count(query);

    return {
      data: employers.map((e) => ({
        id: e._id.toString(),
        name: e.name,
        email: e.email,
        verified: e.verified,
        blocked: e.blocked,
        joinDate: e.joinDate ? e.joinDate.toISOString() : "",
        jobsPosted: e.jobsPosted ?? 0,
      })),
      total,
    };
  }

  async blockUnblockEmployer(data: BlockEmployerDTO): Promise<EmployerResponseDTO> {
    const employer = await this.employerRepo.updateBlockStatus(data.employerId, data.block);
    if (!employer) throw new Error("Employer not found");

    return {
      id: employer._id.toString(),
      name: employer.name,
      email: employer.email,
      verified: employer.verified,
      blocked: employer.blocked,
      joinDate: employer.joinDate ? employer.joinDate?.toISOString() : "",
      jobsPosted: employer.jobsPosted ?? 0,
    };
  }

  async getEmployerById(id: string): Promise<EmployerResponseDTO | null> {
    const employer = await this.employerRepo.findById(id);
    if (!employer) return null;

    return {
      id: employer._id.toString(),
      name: employer.name,
      email: employer.email,
      verified: employer.verified,
      blocked: employer.blocked,
      joinDate: employer.joinDate ? employer.joinDate?.toISOString() : "",
      jobsPosted: employer.jobsPosted ?? 0,
    };
  }
}
