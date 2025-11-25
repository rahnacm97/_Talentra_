import { FilterQuery } from "mongoose";
import { EmployerRepository } from "../../repositories/employer/employer.repository";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import {
  BlockEmployerDTO,
  EmployerResponseDTO,
} from "../../dto/admin/employer.dto";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IEmployerMapper } from "../../interfaces/users/admin/IEmployerMapper";
import { INotificationService } from "../../interfaces/auth/INotificationService";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";

export class AdminEmployerService implements IAdminEmployerService {
  constructor(
    private _employerRepo: EmployerRepository,
    private _employerMapper: IEmployerMapper,
    private _emailService: INotificationService,
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
    const employer = await this._employerRepo.findById(id);
    if (!employer) throw new Error("Employer Not Found");

    if (!employer.cinNumber || !employer.businessLicense) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.EMPLOYER_VERIFY_ERROR,
      );
    }

    const updated = await this._employerRepo.updateOne(id, {
      verified: true,
      rejected: false,
      rejectionReason: "",
    });
    if (!updated) throw new Error("Employer not found");

    const dto = this._employerMapper.toEmployerResponseDTO(updated);
    try {
      await this._emailService.sendEmployerVerificationEmail({
        to: employer.email,
        name: employer.name,
        companyName: employer.name,
      });
    } catch (emailErr: unknown) {
      const message =
        emailErr instanceof Error
          ? emailErr.message
          : ERROR_MESSAGES.EMPLOYER_VERIFY_ERROR;
      logger.warn("Failed to send verification email", {
        employerId: id,
        error: message,
      });
    }
    return dto;
  }

  async rejectEmployer(
    id: string,
    reason: string,
  ): Promise<EmployerResponseDTO> {
    const employer = await this._employerRepo.findById(id);
    if (!employer) throw new Error("Employer Not Found");

    const updated = await this._employerRepo.updateOne(id, {
      verified: false,
      rejected: true,
      rejectionReason: reason,
      rejectionCreatedAt: new Date(),
    });
    if (!updated) throw new Error("Failed to update employer");

    const dto = this._employerMapper.toEmployerResponseDTO(updated);

    try {
      await this._emailService.sendEmployerRejectionEmail({
        to: employer.email,
        name: employer.name,
        companyName: employer.name,
        reason,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
      });
    } catch (emailErr: unknown) {
      const message =
        emailErr instanceof Error
          ? emailErr.message
          : ERROR_MESSAGES.EMPLOYER_REJECTION_ERROR;
      logger.warn("Failed to send rejection email", {
        employerId: id,
        error: message,
      });
    }

    return dto;
  }
}
