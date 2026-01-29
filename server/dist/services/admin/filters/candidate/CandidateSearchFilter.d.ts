import { FilterQuery } from "mongoose";
import { ICandidate } from "../../../../interfaces/users/candidate/ICandidate";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class CandidateSearchFilter implements IQueryFilter<ICandidate> {
    private search?;
    constructor(search?: string | undefined);
    apply(query: FilterQuery<ICandidate>): void;
}
//# sourceMappingURL=CandidateSearchFilter.d.ts.map