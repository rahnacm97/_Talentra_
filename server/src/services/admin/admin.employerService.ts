import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import {
  BlockEmployerDTO,
  EmployerResponseDTO,
} from "../../dto/admin/employer.dto";
import { IEmployerMapper } from "../../interfaces/users/admin/IEmployerMapper";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { ApiError } from "../../shared/utils/ApiError";
import { HTTP_STATUS } from "../../shared/httpStatus/httpStatusCode";
import { ERROR_MESSAGES } from "../../shared/enums/enums";
import { logger } from "../../shared/utils/logger";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import { EmployerFilterProcessor } from "./filters/employer/EmployerFilterProcessor";
import { EmployerSearchFilter } from "./filters/employer/EmployerSearchFilter";
import { EmployerStatusFilter } from "./filters/employer/EmployerStatusFilter";
import { EmployerVerificationFilter } from "./filters/employer/EmployerVerificationFilter";

export class AdminEmployerService implements IAdminEmployerService {
  constructor(
    private _employerRepo: IEmployerRepository,
    private _employerMapper: IEmployerMapper,
    private _notificationService: INotificationService,
  ) {}
  //Fecthing all employers
  async getAllEmployers(
    page: number,
    limit: number,
    search?: string,
    status?: "active" | "blocked",
    verification?: "verified" | "pending",
  ): Promise<{ data: EmployerResponseDTO[]; total: number }> {
    const filterProcessor = new EmployerFilterProcessor();
    filterProcessor.addFilter(new EmployerSearchFilter(search));
    filterProcessor.addFilter(new EmployerStatusFilter(status));
    filterProcessor.addFilter(new EmployerVerificationFilter(verification));

    const query = filterProcessor.buildQuery();

    const employers = await this._employerRepo.findAll(query, page, limit);
    const total = await this._employerRepo.count(query);

    return {
      data: employers.map((e) => this._employerMapper.toEmployerResponseDTO(e)),
      total,
    };
  }
  //Block or unblock employers
  async blockUnblockEmployer(
    data: BlockEmployerDTO,
  ): Promise<EmployerResponseDTO> {
    const employerEntity = this._employerMapper.toBlockEmployerEntity(data);
    const employer = await this._employerRepo.updateBlockStatus(
      employerEntity.employerId,
      employerEntity.block,
    );
    if (!employer) throw new Error("Employer not found");

    if (employerEntity.block) {
      this._notificationService.emitUserBlocked(
        employerEntity.employerId,
        "Employer",
      );
    } else {
      this._notificationService.emitUserUnblocked(
        employerEntity.employerId,
        "Employer",
      );
    }

    return this._employerMapper.toEmployerResponseDTO(employer);
  }
  //Fetching single employer
  async getEmployerById(id: string): Promise<EmployerResponseDTO | null> {
    const employer = await this._employerRepo.findById(id);
    if (!employer) return null;

    return this._employerMapper.toEmployerResponseDTO(employer);
  }
  //Verify employer approval
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

    // Notify employer of verification approval
    await this._notificationService.notifyEmployerVerificationApproved(id);

    try {
      await this._notificationService.sendEmployerVerificationEmail({
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
  //Rejecting employer verification
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

    // Notify employer of verification rejection
    await this._notificationService.notifyEmployerVerificationRejected(
      id,
      reason,
    );
    try {
      await this._notificationService.sendEmployerRejectionEmail({
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
