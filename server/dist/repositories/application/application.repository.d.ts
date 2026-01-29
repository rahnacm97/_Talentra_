import { ICandidateApplicationRepository, IEmployerApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IApplication, IApplicationQuery, IApplicationWithJob, IEmployerApplicationResponse } from "../../interfaces/applications/IApplication";
import { PipelineStage, FilterQuery } from "mongoose";
export declare class ApplicationRepository implements ICandidateApplicationRepository, IEmployerApplicationRepository {
    create(data: Partial<IApplication>): Promise<IApplication>;
    findByJobAndCandidate(jobId: string, candidateId: string): Promise<IApplication | null>;
    countByJobId(jobId: string): Promise<number>;
    countByCandidateId(candidateId: string, filters?: {
        status?: IApplicationQuery["status"];
        search?: string;
    }): Promise<number>;
    findByCandidateIdWithJob(candidateId: string, query?: IApplicationQuery & {
        search?: string;
    }): Promise<IApplicationWithJob[]>;
    findOneWithJob(applicationId: string): Promise<IApplicationWithJob | null>;
    findByEmployerIdWithJob(employerId: string, filters?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        jobTitle?: string;
    }): Promise<IEmployerApplicationResponse[]>;
    countByEmployerId(employerId: string, filters?: {
        search?: string;
        status?: string;
        jobTitle?: string;
    }): Promise<number>;
    updateOne(applicationId: string, data: {
        status?: string;
        notes?: string;
        rating?: number;
    }): Promise<IApplication | null>;
    findByIdForEmployer(applicationId: string, employerId: string): Promise<IEmployerApplicationResponse | null>;
    findByIdAndEmployer(applicationId: string, employerId: string): Promise<IApplication | null>;
    private toDomain;
    count(query?: FilterQuery<IApplication>): Promise<number>;
    aggregate<T>(pipeline: PipelineStage[]): Promise<T[]>;
    find(query: FilterQuery<IApplication>): Promise<IApplication[]>;
}
//# sourceMappingURL=application.repository.d.ts.map