import { FilterQuery } from "mongoose";
import { ICandidate } from "../../../../interfaces/users/candidate/ICandidate";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class CandidateStatusFilter implements IQueryFilter<ICandidate> {
    private status?;
    constructor(status?: "active" | "blocked" | undefined);
    apply(query: FilterQuery<ICandidate>): void;
}
//# sourceMappingURL=CandidateStatusFilter.d.ts.map