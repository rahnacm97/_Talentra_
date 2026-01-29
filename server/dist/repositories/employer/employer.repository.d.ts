import { BaseRepository } from "../base.repository";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { EmployerDataDTO } from "../../dto/employer/employer.dto";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import { IEmployerAnalyticsRepository } from "../../interfaces/users/employer/IEmployerRepo";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IEmployerStats, IApplicationOverTime, IApplicationByStatus, IJobPerformance, IHiringStage, ITimeToHire } from "../../interfaces/users/employer/IAnalyticsTypes";
import mongoose from "mongoose";
export declare class EmployerRepository extends BaseRepository<IEmployer, AuthSignupDTO> implements IEmployerVerificationRepo, IEmployerRepository {
    constructor();
    findByEmail(email: string): Promise<IEmployer | null>;
    updateBlockStatus(employerId: string, block: boolean): Promise<(mongoose.Document<unknown, {}, IEmployer, {}, {}> & IEmployer & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    updateVerificationStatus(id: string, verified: boolean): Promise<(mongoose.FlattenMaps<IEmployer> & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    updateOne(id: string, data: Partial<IEmployer>): Promise<(mongoose.Document<unknown, {}, IEmployer, {}, {}> & IEmployer & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    updateProfile(employerId: string, data: EmployerDataDTO): Promise<IEmployer | null>;
    isVerified(employerId: string): Promise<boolean>;
}
export declare class EmployerAnalyticsRepository implements IEmployerAnalyticsRepository {
    private _jobRepository;
    private _applicationRepository;
    private _interviewRepository;
    constructor(_jobRepository: IJobRepository, _applicationRepository: IApplicationRepository, _interviewRepository: IInterviewRepository);
    getEmployerStats(employerId: string, timeRange?: string): Promise<IEmployerStats>;
    private calculateStartDate;
    getApplicationsOverTime(employerId: string, timeRange: string): Promise<IApplicationOverTime[]>;
    getApplicationsByStatus(employerId: string): Promise<IApplicationByStatus[]>;
    getJobPostingPerformance(employerId: string, timeRange?: string): Promise<IJobPerformance[]>;
    getHiring(employerId: string): Promise<IHiringStage[]>;
    getTimeToHire(employerId: string, timeRange?: string): Promise<ITimeToHire[]>;
}
//# sourceMappingURL=employer.repository.d.ts.map