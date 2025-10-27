import { FilterQuery } from "mongoose";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import {
  BlockEmployerDTO,
  EmployerResponseDTO,
} from "../../dto/admin/employer.dto";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IEmployerMapper } from "../../interfaces/users/admin/IEmployerMapper";

export class AdminEmployerService implements IAdminEmployerService {
  constructor(
    private _employerRepo: EmployerRepository,
    private _employerMapper: IEmployerMapper,
  ) {}

  async getAllEmployers(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: EmployerResponseDTO[]; total: number }> {
    const query: FilterQuery<IEmployer> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employers = await this._employerRepo.findAll(query, page, limit);
    const total = await this._employerRepo.count(query);

    return {
      data: employers.map((e) => this._employerMapper.toEmployerResponseDTO(e)),
      total,
    };
  }

  async blockUnblockEmployer(
    data: BlockEmployerDTO,
  ): Promise<EmployerResponseDTO> {
    const employerEntity = this._employerMapper.toBlockEmployerEntity(data);
    const employer = await this._employerRepo.updateBlockStatus(
      employerEntity.employerId,
      employerEntity.block,
    );
    if (!employer) throw new Error("Employer not found");

    return this._employerMapper.toEmployerResponseDTO(employer);
  }

  async getEmployerById(id: string): Promise<EmployerResponseDTO | null> {
    const employer = await this._employerRepo.findById(id);
    if (!employer) return null;

    return this._employerMapper.toEmployerResponseDTO(employer);
  }

  async verifyEmployer(id: string): Promise<EmployerResponseDTO> {
    const employer = await this._employerRepo.updateVerificationStatus(
      id,
      true,
    );
    if (!employer) throw new Error("Employer not found");

    return this._employerMapper.toEmployerResponseDTO(employer);
  }
}
