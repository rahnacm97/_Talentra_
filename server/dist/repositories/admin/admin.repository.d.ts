import { Document } from "mongoose";
import { IAdmin } from "../../interfaces/users/admin/IAdmin";
import { IUserReader, IUserWriter } from "../../interfaces/auth/IAuthRepository";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";
import { BaseRepository } from "../base.repository";
import { IAdminAnalyticsRepository, IDashboardStats, ITopPerformingJob, IRecentSubscription, IPlatformGrowth, IUserDistribution, IApplicationStatusDistribution, ITopJobCategory, ISubscriptionRevenue } from "../../interfaces/users/admin/IAdminAnalyticsRepository";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IBaseRepository } from "../../interfaces/IBaseRepository";
import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
export declare class AdminRepository extends BaseRepository<IAdmin & Document, AuthSignupDTO> implements IUserReader<IAdmin>, IUserWriter<IAdmin> {
    constructor();
    findById(id: string): Promise<IAdmin | null>;
    findByEmail(email: string): Promise<IAdmin | null>;
}
export declare class AdminAnalyticsRepository implements IAdminAnalyticsRepository {
    private _candidateRepo;
    private _employerRepo;
    private _jobRepo;
    private _applicationRepo;
    private _interviewRepo;
    constructor(_candidateRepo: IBaseRepository<ICandidate, AuthSignupDTO>, _employerRepo: IBaseRepository<IEmployer, AuthSignupDTO>, _jobRepo: IJobRepository, _applicationRepo: IApplicationRepository, _interviewRepo: IInterviewRepository);
    getDashboardStats(): Promise<IDashboardStats>;
    getTopPerformingJobs(limit: number): Promise<ITopPerformingJob[]>;
    getRecentSubscriptions(limit: number): Promise<IRecentSubscription[]>;
    getPlatformGrowthOverTime(timeRange: string): Promise<IPlatformGrowth[]>;
    getUserDistribution(): Promise<IUserDistribution[]>;
    getApplicationStatusDistribution(): Promise<IApplicationStatusDistribution[]>;
    getTopJobCategories(limit: number): Promise<ITopJobCategory[]>;
    getSubscriptionRevenueTrends(timeRange: string): Promise<ISubscriptionRevenue[]>;
}
//# sourceMappingURL=admin.repository.d.ts.map