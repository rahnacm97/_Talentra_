import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import { IJob, ExperienceLevel } from "../../interfaces/jobs/IJob";
import { FilterQuery, PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
export declare class JobRepository implements IJobRepository {
    private readonly _SKILL_KEYWORDS;
    private _extractSkills;
    create(jobData: Partial<IJob>): Promise<IJob>;
    findByEmployerId(employerId: string): Promise<IJob[]>;
    findByIdAndEmployer(jobId: string, employerId: string): Promise<IJob | null>;
    update(jobId: string, updateData: Partial<IJob>): Promise<IJob | null>;
    delete(jobId: string): Promise<IJob | null>;
    findPaginated(employerId: string, { page, limit, search, status, }: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<{
        jobs: (mongoose.FlattenMaps<IJob> & Required<{
            _id: mongoose.FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    closeJob(jobId: string): Promise<IJob | null>;
    findPublicPaginated(params: {
        page: number;
        limit: number;
        search?: string;
        location?: string;
        type?: string;
        experience?: ExperienceLevel;
        skills?: string[];
    }): Promise<{
        jobs: (IJob & {
            employer?: IEmployer;
            extractedSkills?: string[];
        })[];
        total: number;
    }>;
    getAvailableSkills(): Promise<string[]>;
    findById(id: string): Promise<(IJob & {
        employer?: IEmployer;
    }) | null>;
    countAll(): Promise<number>;
    findAllAdminPaginated(params: {
        page: number;
        limit: number;
        search?: string;
        status?: "active" | "closed" | "draft" | "all";
        type?: string;
    }): Promise<{
        jobs: (IJob & {
            employer?: IEmployer;
        })[];
        total: number;
    }>;
    incrementApplicants(jobId: string): Promise<void>;
    count(query?: FilterQuery<IJob>): Promise<number>;
    aggregate<T>(pipeline: PipelineStage[]): Promise<T[]>;
}
//# sourceMappingURL=job.repository.d.ts.map