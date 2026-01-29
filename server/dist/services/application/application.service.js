"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerApplicationService = exports.CandidateApplicationService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
const logger_1 = require("../../shared/utils/logger");
const fileUpload_1 = require("../../shared/utils/fileUpload");
const StatusHandlerRegistry_1 = require("./handlers/StatusHandlerRegistry");
class CandidateApplicationService {
    constructor(_appRepo, _jobRepo, _mapper, _candidateService, _notificationService) {
        this._appRepo = _appRepo;
        this._jobRepo = _jobRepo;
        this._mapper = _mapper;
        this._candidateService = _candidateService;
        this._notificationService = _notificationService;
    }
    //Candidate Job apply
    async apply(jobId, candidateId, payload) {
        const job = await this._jobRepo.findById(jobId);
        if (!job) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.JOB_NOT_FOUND);
        }
        if (job.deadline < new Date()) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.GONE, enums_1.ERROR_MESSAGES.DEADLINE_PASSED);
        }
        if (job.status !== "active") {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.GONE, enums_1.ERROR_MESSAGES.JOB_INACTIVE);
        }
        const existing = await this._appRepo.findByJobAndCandidate(jobId, candidateId);
        if (existing) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.CONFLICT, enums_1.ERROR_MESSAGES.JOB_CONFLICT);
        }
        let resumeUrl;
        if (payload.useExistingResume) {
            const candidate = await this._candidateService.getCandidateById(candidateId);
            if (!candidate?.resume) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "No saved resume found. Please upload a resume.");
            }
            resumeUrl = candidate.resume;
        }
        else if (payload.resumeFile) {
            resumeUrl = await (0, fileUpload_1.uploadResumeFile)(payload.resumeFile);
        }
        else {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.RESUME_REQUIRED);
        }
        const application = await this._appRepo.create({
            jobId,
            candidateId,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            resume: resumeUrl,
            coverLetter: payload.coverLetter ?? "",
        });
        await this._jobRepo.incrementApplicants(jobId);
        // Notify employer of new application
        await this._notificationService.notifyEmployerNewApplication(job.employerId, payload.fullName, job.title, jobId, application.id);
        logger_1.logger.info("Application submitted", {
            applicationId: application.id,
            jobId,
            candidateId,
            resumeSource: payload.useExistingResume ? "profile" : "upload",
        });
        return this._mapper.toResponseDto(application);
    }
    //Fetching candidate applications
    async getApplicationsForCandidate(candidateId, filters) {
        const query = {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 5,
        };
        if (filters?.status && filters.status !== "all") {
            query.status = filters.status;
        }
        let apps = await this._appRepo.findByCandidateIdWithJob(candidateId, {
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 5,
            ...(filters?.status &&
                filters.status !== "all" && { status: filters.status }),
            ...(filters?.search && { search: filters.search }),
        });
        const total = await this._appRepo.countByCandidateId(candidateId, {
            ...(filters?.status &&
                filters.status !== "all" && { status: filters.status }),
            ...(filters?.search && { search: filters.search }),
        });
        const page = query.page ?? 1;
        const limit = query.limit ?? 5;
        const totalPages = Math.ceil(total / limit);
        return {
            data: this._mapper.toApplicationsResponseDtoList(apps),
            pagination: { page, limit, total, totalPages },
        };
    }
    //Fetch single candidate application
    async getApplicationById(applicationId, candidateId) {
        const application = await this._appRepo.findOneWithJob(applicationId);
        if (!application) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, "Application not found");
        }
        if (application.candidateId !== candidateId) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, "Access denied");
        }
        return this._mapper.toApplicationsResponseDto(application);
    }
}
exports.CandidateApplicationService = CandidateApplicationService;
class EmployerApplicationService {
    constructor(_appRepo, _mapper, _notificationService, _interviewService, _chatService) {
        this._appRepo = _appRepo;
        this._mapper = _mapper;
        this._notificationService = _notificationService;
        this._interviewService = _interviewService;
        this._chatService = _chatService;
    }
    //Fetching application in employer side
    async getApplicationsForEmployer(employerId, filters = {}) {
        const [apps, total] = await Promise.all([
            this._appRepo.findByEmployerIdWithJob(employerId, filters),
            this._appRepo.countByEmployerId(employerId, filters),
        ]);
        const page = Math.max(filters.page ?? 1, 1);
        const limit = Math.max(filters.limit ?? 5, 1);
        const dtos = this._mapper.toDtoList(apps);
        return {
            applications: dtos,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    //Updating application status
    async updateApplicationStatus(employerId, applicationId, data) {
        const app = await this._appRepo.findOneWithJob(applicationId);
        if (!app)
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.APPLICATION_NOT_FOUND);
        // <<<<<<< HEAD
        //     const handler = StatusHandlerRegistry.getHandler(data.status);
        //     await handler.handle({
        //       application: app,
        //       employerId,
        //       data,
        //       appRepo: this._appRepo,
        //       interviewService: this._interviewService,
        //       chatService: this._chatService,
        //     });
        // =======
        // <<<<<<< Updated upstream
        //     const updateData: IApplicationUpdate = { status: data.status };
        // >>>>>>> a4015c2 (Implement interview feature with rounds, feedback, and video flow)
        //     // Notifying candidate of status change
        //     const notificationHelper = NotificationHelper.getInstance();
        //     await notificationHelper.notifyCandidateApplicationStatusChange(
        //       app.candidateId,
        //       data.status,
        //       app.job.title,
        //       app.jobId,
        //       applicationId,
        //       app.employer.name,
        //     );
        //     const apps = await this._appRepo.findByEmployerIdWithJob(employerId, {
        //       limit: 20,
        //     });
        //     const freshData = apps.find((a) => a.id === applicationId);
        // =======
        const handler = StatusHandlerRegistry_1.StatusHandlerRegistry.getHandler(data.status);
        await handler.handle({
            application: app,
            employerId,
            data: data,
            appRepo: this._appRepo,
            interviewService: this._interviewService,
            chatService: this._chatService,
        });
        // Notifying candidate of status change
        await this._notificationService.notifyCandidateApplicationStatusChange(app.candidateId, data.status, app.job.title, app.jobId, applicationId, app.employer.name);
        const freshData = await this._appRepo.findByIdForEmployer(applicationId, employerId);
        if (!freshData)
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, enums_1.ERROR_MESSAGES.FAILED_LOADING);
        return this._mapper.toDto(freshData);
    }
}
exports.EmployerApplicationService = EmployerApplicationService;
//# sourceMappingURL=application.service.js.map