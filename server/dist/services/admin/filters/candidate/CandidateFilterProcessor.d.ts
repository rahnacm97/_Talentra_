import { FilterQuery } from "mongoose";
import { ICandidate } from "../../../../interfaces/users/candidate/ICandidate";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class CandidateFilterProcessor {
    private filters;
    addFilter(filter: IQueryFilter<ICandidate>): void;
    buildQuery(): FilterQuery<ICandidate>;
}
//# sourceMappingURL=CandidateFilterProcessor.d.ts.map