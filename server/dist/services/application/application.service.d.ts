import { ICandidateApplicationService, ApplyJobPayload, IEmployerApplicationService } from "../../interfaces/applications/IApplicationService";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { IChatService } from "../../interfaces/chat/IChatService";
import { GetApplicationsFilters } from "../../type/application/application.type";
import { ICandidateApplicationRepository, IEmployerApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IApplicationMapper, IEmployerApplicationMapper } from "../../interfaces/applications/IApplicationMapper";
import { ApplicationResponseDto, ApplicationsResponseDto, EmployerApplicationsPaginatedDto, EmployerApplicationResponseDto } from "../../dto/application/application.dto";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { ICandidateService } from "../../interfaces/users/candidate/ICandidateService";
export declare class CandidateApplicationService implements ICandidateApplicationService {
    private readonly _appRepo;
    private readonly _jobRepo;
    private readonly _mapper;
    private readonly _candidateService;
    private readonly _notificationService;
    constructor(_appRepo: ICandidateApplicationRepository, _jobRepo: IJobRepository, _mapper: IApplicationMapper, _candidateService: ICandidateService, _notificationService: INotificationService);
    apply(jobId: string, candidateId: string, payload: ApplyJobPayload): Promise<ApplicationResponseDto>;
    getApplicationsForCandidate(candidateId: string, filters?: {
        status?: "pending" | "reviewed" | "rejected" | "accepted" | "interview" | "shortlisted" | "hired" | "all";
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ApplicationsResponseDto[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getApplicationById(applicationId: string, candidateId: string): Promise<ApplicationsResponseDto>;
}
export declare class EmployerApplicationService implements IEmployerApplicationService {
    private readonly _appRepo;
    private readonly _mapper;
    private readonly _notificationService;
    private readonly _interviewService?;
    private readonly _chatService?;
    constructor(_appRepo: IEmployerApplicationRepository, _mapper: IEmployerApplicationMapper, _notificationService: INotificationService, _interviewService?: IInterviewService | undefined, _chatService?: IChatService | undefined);
    getApplicationsForEmployer(employerId: string, filters?: GetApplicationsFilters): Promise<EmployerApplicationsPaginatedDto>;
    updateApplicationStatus(employerId: string, applicationId: string, data: {
        status: string;
        interviewDate?: string;
        interviewLink?: string;
    }): Promise<EmployerApplicationResponseDto>;
}
//# sourceMappingURL=application.service.d.ts.map