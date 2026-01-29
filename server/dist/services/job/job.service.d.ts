import { IEmployerJobService } from "../../interfaces/jobs/IJobService";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IJobMapper } from "../../interfaces/jobs/IJobMapper";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";
import { CreateJobDto } from "../../shared/validations/job.validation";
import { JobResponseDto } from "../../dto/job/job.dto";
import { ICandidateJobService } from "../../interfaces/jobs/IJobService";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { ExperienceLevel } from "../../interfaces/jobs/IJob";
import { IAdminJobService } from "../../interfaces/jobs/IJobService";
import { IAdminJobMapper } from "../../interfaces/users/admin/IAdminJobMapper";
import { AdminJob } from "../../type/admin/admin.types";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";
export declare class EmployerJobService implements IEmployerJobService {
    private readonly _repository;
    private readonly _mapper;
    private readonly _employerVerifier;
    constructor(_repository: IJobRepository, _mapper: IJobMapper, _employerVerifier: IEmployerVerificationRepo);
    private parseDeadline;
    private verifyEmployer;
    createJob(employerId: string, dto: CreateJobDto): Promise<JobResponseDto>;
    getJobsByEmployer(employerId: string): Promise<JobResponseDto[]>;
    updateJob(employerId: string, jobId: string, dto: Partial<CreateJobDto>): Promise<JobResponseDto>;
    getJobsPaginated(employerId: string, page: number, limit: number, search?: string, status?: "active" | "closed" | "draft" | "all"): Promise<{
        jobs: JobResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    closeJob(employerId: string, jobId: string): Promise<JobResponseDto>;
}
export declare class CandidateJobService implements ICandidateJobService {
    private readonly _repository;
    private readonly _candRepository;
    private readonly _mapper;
    private readonly _applicationRepo;
    constructor(_repository: IJobRepository, _candRepository: ICandidateRepo, _mapper: IJobMapper, _applicationRepo: IApplicationRepository);
    getPublicJobs(params: {
        page: number;
        limit: number;
        search?: string;
        location?: string;
        type?: string;
        experience?: ExperienceLevel;
        skills?: string[];
    }): Promise<{
        jobs: JobResponseDto[];
        total: number;
        page: number;
        limit: number;
        availableSkills: string[];
    }>;
    getJobById(id: string, candidateId?: string): Promise<JobResponseDto>;
    saveJob(candidateId: string, jobId: string): Promise<void>;
    unsaveJob(candidateId: string, jobId: string): Promise<void>;
    getSavedJobs(candidateId: string, params?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
    }): Promise<{
        jobs: JobResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
}
export declare class AdminJobService implements IAdminJobService {
    private readonly _repository;
    private readonly _adminMapper;
    constructor(_repository: IJobRepository, _adminMapper: IAdminJobMapper);
    getAllJobsForAdmin(params: {
        page: number;
        limit: number;
        search?: string;
        status?: "active" | "closed" | "all";
        type?: string;
    }): Promise<{
        jobs: AdminJob[];
        total: number;
        page: number;
        limit: number;
    }>;
}
//# sourceMappingURL=job.service.d.ts.map