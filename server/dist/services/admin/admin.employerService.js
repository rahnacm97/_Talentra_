"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEmployerService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
const logger_1 = require("../../shared/utils/logger");
const EmployerFilterProcessor_1 = require("./filters/employer/EmployerFilterProcessor");
const EmployerSearchFilter_1 = require("./filters/employer/EmployerSearchFilter");
const EmployerStatusFilter_1 = require("./filters/employer/EmployerStatusFilter");
const EmployerVerificationFilter_1 = require("./filters/employer/EmployerVerificationFilter");
class AdminEmployerService {
    constructor(_employerRepo, _employerMapper, _notificationService) {
        this._employerRepo = _employerRepo;
        this._employerMapper = _employerMapper;
        this._notificationService = _notificationService;
    }
    //Fecthing all employers
    async getAllEmployers(page, limit, search, status, verification) {
        const filterProcessor = new EmployerFilterProcessor_1.EmployerFilterProcessor();
        filterProcessor.addFilter(new EmployerSearchFilter_1.EmployerSearchFilter(search));
        filterProcessor.addFilter(new EmployerStatusFilter_1.EmployerStatusFilter(status));
        filterProcessor.addFilter(new EmployerVerificationFilter_1.EmployerVerificationFilter(verification));
        const query = filterProcessor.buildQuery();
        const employers = await this._employerRepo.findAll(query, page, limit);
        const total = await this._employerRepo.count(query);
        return {
            data: employers.map((e) => this._employerMapper.toEmployerResponseDTO(e)),
            total,
        };
    }
    //Block or unblock employers
    async blockUnblockEmployer(data) {
        const employerEntity = this._employerMapper.toBlockEmployerEntity(data);
        const employer = await this._employerRepo.updateBlockStatus(employerEntity.employerId, employerEntity.block);
        if (!employer)
            throw new Error("Employer not found");
        if (employerEntity.block) {
            this._notificationService.emitUserBlocked(employerEntity.employerId, "Employer");
        }
        else {
            this._notificationService.emitUserUnblocked(employerEntity.employerId, "Employer");
        }
        return this._employerMapper.toEmployerResponseDTO(employer);
    }
    //Fetching single employer
    async getEmployerById(id) {
        const employer = await this._employerRepo.findById(id);
        if (!employer)
            return null;
        return this._employerMapper.toEmployerResponseDTO(employer);
    }
    //Verify employer approval
    async verifyEmployer(id) {
        const employer = await this._employerRepo.findById(id);
        if (!employer)
            throw new Error("Employer Not Found");
        if (!employer.cinNumber || !employer.businessLicense) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.EMPLOYER_VERIFY_ERROR);
        }
        const updated = await this._employerRepo.updateOne(id, {
            verified: true,
            rejected: false,
            rejectionReason: "",
        });
        if (!updated)
            throw new Error("Employer not found");
        const dto = this._employerMapper.toEmployerResponseDTO(updated);
        // Notify employer of verification approval
        await this._notificationService.notifyEmployerVerificationApproved(id);
        try {
            await this._notificationService.sendEmployerVerificationEmail({
                to: employer.email,
                name: employer.name,
                companyName: employer.name,
            });
        }
        catch (emailErr) {
            const message = emailErr instanceof Error
                ? emailErr.message
                : enums_1.ERROR_MESSAGES.EMPLOYER_VERIFY_ERROR;
            logger_1.logger.warn("Failed to send verification email", {
                employerId: id,
                error: message,
            });
        }
        return dto;
    }
    //Rejecting employer verification
    async rejectEmployer(id, reason) {
        const employer = await this._employerRepo.findById(id);
        if (!employer)
            throw new Error("Employer Not Found");
        const updated = await this._employerRepo.updateOne(id, {
            verified: false,
            rejected: true,
            rejectionReason: reason,
            rejectionCreatedAt: new Date(),
        });
        if (!updated)
            throw new Error("Failed to update employer");
        const dto = this._employerMapper.toEmployerResponseDTO(updated);
        // Notify employer of verification rejection
        await this._notificationService.notifyEmployerVerificationRejected(id, reason);
        try {
            await this._notificationService.sendEmployerRejectionEmail({
                to: employer.email,
                name: employer.name,
                companyName: employer.name,
                reason,
                loginUrl: `${process.env.FRONTEND_URL}/login`,
            });
        }
        catch (emailErr) {
            const message = emailErr instanceof Error
                ? emailErr.message
                : enums_1.ERROR_MESSAGES.EMPLOYER_REJECTION_ERROR;
            logger_1.logger.warn("Failed to send rejection email", {
                employerId: id,
                error: message,
            });
        }
        return dto;
    }
}
exports.AdminEmployerService = AdminEmployerService;
//# sourceMappingURL=admin.employerService.js.map