import { BaseRepository } from "../base.repository";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ProfileData } from "../../type/candidate/candidate.types";
import { ICandidateRepo } from "../../interfaces/users/candidate/ICandidateRepository";
import { IJob } from "../../interfaces/jobs/IJob";
import { AuthSignupDTO } from "../../dto/auth/auth.dto";
export declare class CandidateRepository extends BaseRepository<ICandidate, AuthSignupDTO> implements ICandidateRepo {
    constructor();
    findByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, ICandidate, {}, {}> & ICandidate & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    updateBlockStatus(id: string, block: boolean): Promise<ICandidate | null>;
    updateProfile(id: string, data: ProfileData): Promise<ICandidate | null>;
    saveJob(candidateId: string, jobId: string): Promise<ICandidate | null>;
    unsaveJob(candidateId: string, jobId: string): Promise<ICandidate | null>;
    getSavedJobs(candidateId: string): Promise<IJob[]>;
}
//# sourceMappingURL=candidate.repository.d.ts.map