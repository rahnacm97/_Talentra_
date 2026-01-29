import { EmployerDataDTO } from "../../../dto/employer/employer.dto";
import { IEmployer } from "./IEmployer";
import { IEmployerStats, IApplicationByStatus, IApplicationOverTime, IJobPerformance, IHiringStage, ITimeToHire } from "./IAnalyticsTypes";
export interface IEmployerRepo<T> {
    updateBlockStatus?(id: string, block: boolean): Promise<T | null>;
    updateProfile(employerId: string, data: EmployerDataDTO): Promise<T | null>;
    findVerifiedStatus(employerId: string): Promise<boolean>;
    updateOne(id: string, data: Partial<IEmployer>): Promise<T | null>;
}
export interface IEmployerAnalyticsRepository {
    getEmployerStats(employerId: string, timeRange?: string): Promise<IEmployerStats>;
    getApplicationsOverTime(employerId: string, timeRange: string): Promise<IApplicationOverTime[]>;
    getApplicationsByStatus(employerId: string): Promise<IApplicationByStatus[]>;
    getJobPostingPerformance(employerId: string, timeRange?: string): Promise<IJobPerformance[]>;
    getHiring(employerId: string): Promise<IHiringStage[]>;
    getTimeToHire(employerId: string, timeRange?: string): Promise<ITimeToHire[]>;
}
//# sourceMappingURL=IEmployerRepo.d.ts.map